/** This interface holds all the types of values that can be encoded in a URL string */
export interface SerializableTypeNameToType {
    "string": string;
    "string | null": string | null;
    "date": Date;
    "date | null": Date | null;
    "number": number;
    "number | null": number | null;
    "boolean": boolean;
    "boolean | null": boolean | null;
}
export declare type SerializableTypeName = keyof SerializableTypeNameToType;
/** A type describing the map of parameter names to their types for a route */
export declare type RouteParamsSpec = {
    [paramName: string]: SerializableTypeName;
};
/** A type-level helper function to translate from:
  *   a RouteParamsSpec, ie. a map from parameter names to types in string format
  *   to a map from the same parameter names to the actual types
 */
export declare type SpecToType<S extends RouteParamsSpec> = {
    [K in keyof S]: SerializableTypeNameToType[S[K]];
};
/** A route is a pair of functions:
  *   to match a URL against a route specification
  *   and build a URL from data confirming to that specification
  */
export declare type Route<S extends RouteParamsSpec> = {
    matchUrl: (hash: string) => SpecToType<S> | null;
    buildUrl: (params: SpecToType<S>) => string;
};
/** Make a Route from a name and a specification of its properties */
export declare function makeRoute<S extends RouteParamsSpec>(routeName: string, routeParams: S): Route<S>;
export interface Router<T> {
    match: (hash: string) => T | null;
    registerRoute<S extends RouteParamsSpec>(matcher: Route<S>, handler: (params: SpecToType<S>) => T): Router<T>;
}
export declare function newRouter<T, S extends RouteParamsSpec>(matcher: Route<S>, handler: (params: SpecToType<S>) => T): Router<T>;
