import { ResponsiveSunburst } from "@nivo/sunburst";
import data from "./data.json";

export const INaturalistSunburst = () => {
  return (
    <>
      <ResponsiveSunburst /* or Sunburst for fixed dimensions */
        data={data}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        cornerRadius={2}
        borderColor={{ theme: "background" }}
        enableArcLabels={true}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 1.4]] }}
      />
    </>
  );
};
