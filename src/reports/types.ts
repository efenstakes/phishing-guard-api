import { getModelForClass, pre, prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";



// @ObjectType("ReportingAccount")
// export class Account {
//     @Field(()=> String)
//     @prop({ required: true, })
//     name: String

//     @Field(()=> String)
//     @prop({ required: true, })
//     email: String
// }


@ObjectType()
export class SiteAnalytics {
    @Field(()=> String)
    _id: string

    @Field(()=> String)
    @prop({ required: true, index: true, })
    site: string

    // no of verified reports
    // reports by made by logged in users
    @Field(()=> Number)
    @prop({ required: true, default: 0, })
    verified: number

    // no of verified reports
    // reports by made by logged in users
    @Field(()=> Number)
    @prop({ required: true, default: 0, })
    anonymous: number
}

@ObjectType()
export class Report {
    @Field(()=> String)
    _id: string

    @Field(()=> String)
    @prop({ required: true, index: true, })
    site: string

    @Field(()=> String)
    @prop({ required: true, })
    url: string

    @Field(()=> String)
    @prop({  })
    comment: string


    // @Field(()=> Account)
    // @prop({  })
    // account?: Account

    @Field(()=> Number)
    @prop({ required: true, default: new Date(), })
    addedOn: string
}


export const ReportModel = getModelForClass(Report)
export const SiteAnalyticsModel = getModelForClass(SiteAnalytics)
