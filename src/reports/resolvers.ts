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
        
        const site = new URL(url as string).host.split(".").slice(
            0,
            new URL(url as string).host.split(".").length - 1
        ).join(" ")

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
            url,
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
    async analytics( @Arg("site") site: string ) {

        console.log("site ", site)

        return await SiteAnalyticsModel.findOne({ site, })
    }

    @Query(()=> [Report])
    async reports(
        @Arg("site") site: string,
        @Arg("filters", { defaultValue: { offset: 0, limit: 30, }, nullable: true, }) filters: FiltersInput,
    ) {
        const { offset, limit, } = filters

        console.log("site ", site, " offset ", offset, " limit ", limit)

        return await ReportModel.find({ site, }).lean().skip(offset).limit(limit)
    }

}