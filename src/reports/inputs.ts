import { IsAlphanumeric, IsNumber, IsUrl, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";


@InputType()
export class ReportInput {
    @Field(()=> String)
    site: String

    @IsUrl()
    @Field(()=> String)
    url: String

    @Field(()=> String)
    comment: String

    @Field(()=> String)
    token?: String
}


@InputType()
export class FiltersInput {

    @IsNumber()
    @Field(()=> Number)
    offset?: Number = 0

    @IsNumber()
    @Field(()=> Number)
    limit?: Number = 30

}
