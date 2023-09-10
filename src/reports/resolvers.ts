import { Resolver, Query, Arg, Mutation, } from "type-graphql";
// import { CreateReportInput, } from "./inputs";
import { Report, ReportModel, SiteAnalytics, SiteAnalyticsModel } from "./types";

import admin from 'firebase-admin'
import { CreateReportInput, FiltersInput, } from "./inputs";


@Resolver()
export class ReportResolvers {

    @Mutation(()=> Report, { nullable: true, })
    async report(
        @Arg("input") input: CreateReportInput
    ) {

        console.log('====================================');
        console.log("input ", input);
        console.log('====================================');

        const { url, comment, token } = input

        // ensure url starts with https
        if( new URL(url as string).protocol != "https:" ) {

            console.log('====================================');
            console.log("url must be https ", url);
            console.log('====================================');
            return null
        }
        
        // just to ensure we remove www if it exists in the url
        const siteComponentsList = new URL(url as string).host.split(".").slice(
            0,
            new URL(url as string).host.split(".").length - 1
        )
        const site = (siteComponentsList[0] == "www" ? siteComponentsList.slice(1, siteComponentsList.length) : siteComponentsList).join(" ")

        //  set reporting account to null as default, user is anonymous 
        let account = null

        // if token, verify it then add to db
        if( token ) {
            const result = await admin.auth().verifyIdToken(token as string)

            account = {
                name: result["name"],
                email: result.email,
            }
        }


        // report data
        const data = {
            url: new URL(url).origin,
            site,
            comment,
            account,
            addedOn: Date.now(),
        }
        console.log('====================================');
        console.log("data ", data);
        console.log('====================================');

        // add report
        const report = await new ReportModel(data).save()

        console.log('====================================');
        console.log("add report ", report);
        console.log('====================================');

        // update site analytics
        const updates = account != null ? { verified: 1 } : { anonymous: 1 }
        const siteAnalyticsResult = await SiteAnalyticsModel.findOneAndUpdate(
            { site, },
            {
                $inc: updates
            },
            {
                new: true,
                upsert: true,
            }
        ).lean()

        console.log('====================================');
        console.log("siteAnalyticsResult ", siteAnalyticsResult);
        console.log('====================================');

    
        // return account
        return report.toObject()
    }


    @Query(()=> SiteAnalytics, { nullable: true, })
    async analytics( @Arg("url") url: string ) {

        console.log("url ", url)

        const site = getSiteName(url)
        console.log("site ", site)

        return await SiteAnalyticsModel.findOne({ site, })
    }

    @Query(()=> [Report])
    async reports(
        @Arg("url") url: string,
        @Arg("filters", { defaultValue: { offset: 0, limit: 30, }, nullable: true, }) filters: FiltersInput,
    ) {
        const { offset, limit, } = filters

        console.log("url ", url, " offset ", offset, " limit ", limit)

        const site = getSiteName(url)
        console.log("site ", site)


        return await ReportModel.find({ site, }).lean().skip(offset).limit(limit)
    }

}


const getSiteName = (url: string)=> {
    const siteComponentsList = new URL(url as string).host.split(".").slice(
        0,
        new URL(url as string).host.split(".").length - 1
    )
    const siteName = (siteComponentsList[0] == "www" ? siteComponentsList.slice(1, siteComponentsList.length) : siteComponentsList).join(" ")

    return siteName
}