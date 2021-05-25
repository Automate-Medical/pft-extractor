import PFTX from "./PFTX";
import { App } from "@serverless-stack/resources";

export default function main(app: App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x"
  });

  new PFTX(app, "pftx");
}
