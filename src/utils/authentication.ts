import { AuthChecker } from "type-graphql"
import { Context } from "../sub_types/context"

export const authChecker: AuthChecker<Context> = (_)=> {

    return true
}