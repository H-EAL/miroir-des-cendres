//------------------------------------------------------------------------------
import { useContext, useEffect, useState } from "react";

//------------------------------------------------------------------------------
import { type Livelink as LivelinkInstance, type Entity } from "@3dverse/livelink";
import {
    LivelinkContext,
    Livelink,
    Viewport,
    ViewportContext,
    Canvas,
} from "@3dverse/livelink-react";
import { LoadingOverlay } from "@3dverse/livelink-react-ui";

//------------------------------------------------------------------------------
const token = "public_Knb9Mdj-Ppg6rOHn";
const scene_id = "4862a090-0a16-4f6e-bb6d-14e3d2c8ec5f";
const characterControllerSceneUUID = "d834c10f-765d-41b5-9a75-be74e599f78d";

//------------------------------------------------------------------------------
export default function Game() {
    return (
        <Livelink
            sceneId={scene_id}
            token={token}
            LoadingPanel={LoadingOverlay}
            isTransient={true}
            autoJoinExisting={false}
        >
            <AppLayout />
        </Livelink>
    );
}

//------------------------------------------------------------------------------
function AppLayout() {
    const { instance } = useContext(LivelinkContext);

    useEffect(() => {
        if (!instance) {
            return;
        }

        async function instantiatePlayerSceneAndFindThirdPersonCamera(instance: LivelinkInstance) {
            const playerSceneEntity = await instance.scene.newEntity({
                name: "PlayerSceneEntity",
                components: {
                    local_transform: { position: [0, 0, 0] },
                    scene_ref: { value: characterControllerSceneUUID },
                },
                options: {
                    delete_on_client_disconnection: true,
                },
            });

            const children = await playerSceneEntity.getChildren();
            const thirdPersonController = children.find((child) => child.script_map !== undefined);
            const thirdPersonCameraEntity = children.find((child) => child.camera !== undefined);

            console.log("Assigning client to scripts");
            if (thirdPersonController && instance.session.client_id) {
                thirdPersonController.assignClientToScripts({
                    client_uuid: instance.session.client_id,
                });
            }

            setStartSimulation(true);

            setCameraEntity(thirdPersonCameraEntity ?? null);
        }
        instantiatePlayerSceneAndFindThirdPersonCamera(instance);
    }, [instance]);

    const [startSimulation, setStartSimulation] = useState<boolean>(false);
    const [cameraEntity, setCameraEntity] = useState<Entity | null>(null);

    return (
        <Canvas width={"100vw"} height={"100vh"}>
            <Viewport cameraEntity={cameraEntity} style={{ width: "100%", height: "100%" }}>
                {startSimulation && <SimulationStarter />}
            </Viewport>
        </Canvas>
    );
}

//------------------------------------------------------------------------------
function SimulationStarter() {
    const { instance } = useContext(LivelinkContext);
    const { viewport, viewportDomElement } = useContext(ViewportContext);

    useEffect(() => {
        if (!instance || !viewport || !viewportDomElement) {
            return;
        }

        console.log("Setting up controller");

        viewportDomElement.requestPointerLock();

        instance.devices.keyboard.enable();
        instance.devices.gamepad.enable();
        instance.devices.mouse.enableOnViewport({ viewport });

        instance.startSimulation();
    }, [instance, viewportDomElement]);

    return null;
}
