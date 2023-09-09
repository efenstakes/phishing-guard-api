import { IsAlphanumeric, IsEmail, IsMobilePhone, IsNumber, IsUrl, MinLength, } from "class-validator";
import { Field, InputType } from "type-graphql";


@InputType("CreateReportInput")
export class CreateReportInput {

    @IsUrl()
    @Field(()=> String)
    url: string

    @Field(()=> String)
    comment: string

    @Field(()=> String, { nullable: true, })
    token?: string
}


@InputType("FiltersInput")
export class FiltersInput {

    @IsNumber()
    @Field(()=> Number, { defaultValue: 0 })
    offset?: number

    @IsNumber()
    @Field(()=> Number, { defaultValue: 30 })
    limit?: number

}
