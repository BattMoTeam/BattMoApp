import { getSimulatorBlueprint } from "@workspace/db";
import SimulatorWorkbench from "./_components/simulator-workbench";

export const metadata = { title: "Simulator" };

export default async function SimulatorPage() {
  const tabs = await getSimulatorBlueprint();

  return <SimulatorWorkbench tabs={tabs} />;
}
