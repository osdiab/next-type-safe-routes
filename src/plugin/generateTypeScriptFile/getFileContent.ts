import { ApiRoute, Page } from "./types";

const getTypeSafeRoute = ({ route, params }: ApiRoute) => {
  if (!params?.length) {
    return `"${route}"`;
  }

  return `{ route: "${route}", ${params
    .map((param) => `${param}: string | string[] | number`)
    .join(",")} }`;
};

type Args = {
  apiRoutes: ApiRoute[];
  pages: Page[];
};

const getFileContent = ({
  apiRoutes,
  pages,
}: Args) => `// IMPORTANT! This file is autogenerated by the \`type-safe-next-routes\` 
// package. You should _not_ update these types manually...

declare module "next-type-safe-routes" {
  export type TypeSafePage = ${pages.map(getTypeSafeRoute).join(" | ")};
  ${
    apiRoutes.length > 0
      ? `export type TypeSafeApiRoute = ${apiRoutes
          .map(getTypeSafeRoute)
          .join(" | ")};`
      : ""
  }

  export const getPathname = (typeSafeUrl: TypeSafePage | TypeSafeApiRoute) => string;
  export const getRoute = (typeSafeUrl: TypeSafePage | TypeSafeApiRoute, query?: any) => string;
}
`;

export default getFileContent;
