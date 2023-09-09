import { getModelForClass, pre, prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";



@ObjectType()
export class Account {
    @Field(()=> String)
    name: String

    @Field(()=> String)
    email: String
}


@ObjectType()
export class SiteAnalytics {
    @Field(()=> String)
    _id: String

    @Field(()=> String)
    @prop({ required: true, index: true, })
    site: String

    // no of verified reports
    // reports by made by logged in users
    @Field(()=> Number)
    @prop({ required: true, })
    verified: Number = 0

    // no of verified reports
    // reports by made by logged in users
    @Field(()=> Number)
    @prop({ required: true, })
    anonymous: Number = 0
}

@ObjectType()
export class Report {
    @Field(()=> String)
    _id: String

    @Field(()=> String)
    @prop({ required: true, index: true, })
    site: String

    @Field(()=> String)
    @prop({ required: true, })
    url: String

    @Field(()=> String)
    @prop({  })
    comment: String


    @Field(()=> Account)
    @prop({  })
    account: Account

    @Field(()=> Number)
    @prop({ required: true, })
    joinedOn: String
}


export const ReportModel = getModelForClass(Report)
