//------------------------------------------------------------------------------
import { useContext, useEffect, useState } from "react";
import introImage from "./assets/intro.png"; // Import the intro image

//------------------------------------------------------------------------------
import {
    type Livelink as LivelinkInstance,
    type Entity,
    ScriptEventReceived,
} from "@3dverse/livelink";
import {
    LivelinkContext,
    Livelink,
    Viewport,
    ViewportContext,
    Canvas,
    useEntity,
} from "@3dverse/livelink-react";
import { LoadingOverlay } from "@3dverse/livelink-react-ui";

//------------------------------------------------------------------------------
const token = "public_Knb9Mdj-Ppg6rOHn";
const scene_id = "4862a090-0a16-4f6e-bb6d-14e3d2c8ec5f";
const characterControllerSceneUUID = "d834c10f-765d-41b5-9a75-be74e599f78d";
const startingPoint = "548bfcc7-830a-42f7-8a4d-b63d23c7b2cf";

//------------------------------------------------------------------------------
export default function App() {
    const [showPreIntro, setShowPreIntro] = useState(true);
    const [showGame, setShowGame] = useState(false);

    if (showPreIntro) {
        return <PreIntroPage onProceed={() => setShowPreIntro(false)} />;
    }

    return showGame ? (
        <Livelink
            sceneId={scene_id}
            token={token}
            LoadingPanel={LoadingOverlay}
            isTransient={true}
            autoJoinExisting={false}
        >
            <AppLayout />
        </Livelink>
    ) : (
        <IntroPage onStart={() => setShowGame(true)} />
    );
}

//------------------------------------------------------------------------------
function PreIntroPage({ onProceed }: { onProceed: () => void }) {
    const handleClick = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }

        // Enable sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        onProceed();
    };

    return (
        <div
            style={{
                backgroundColor: "#000000", // Darker black background
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
            }}
            onClick={handleClick}
        >
            <div
                style={{
                    background: "linear-gradient(to bottom, #007777, black)", // Subtle gradient to black
                    fontSize: "5rem",
                    fontFamily: "'Cinzel', serif",
                    textAlign: "center",
                    WebkitBackgroundClip: "text", // Clip the gradient to the text
                    WebkitTextFillColor: "transparent", // Make the text transparent to show the gradient
                }}
            >
                Le Miroir des Cendres
            </div>
            <div
                style={{
                    color: "aqua",
                    background: "linear-gradient(to bottom, grey, black)", // Subtle gradient to black
                    fontSize: "5rem",
                    fontFamily: "'Cinzel', serif",
                    textAlign: "center",
                    transform: "scaleY(-1)",
                    opacity: 0.3, // More subtle reflection
                    marginTop: "0.5rem", // Reduced margin for a tighter look
                    WebkitBackgroundClip: "text", // Clip the gradient to the text
                    WebkitTextFillColor: "transparent", // Make the text transparent to show the gradient
                }}
            >
                Le Miroir des Cendres
            </div>
        </div>
    );
}

//------------------------------------------------------------------------------
function IntroPage({ onStart }: { onStart: () => void }) {
    const [filterStyle, setFilterStyle] = useState("brightness(1) contrast(1)");

    useEffect(() => {
        const flicker = () => {
            // Flicker effect with multiple quick flashes
            setFilterStyle("brightness(1.5) contrast(1.5)");
            setTimeout(() => setFilterStyle("brightness(0.8) contrast(0.8)"), 100);
            setTimeout(() => setFilterStyle("brightness(1.3) contrast(1.3)"), 200);
            setTimeout(() => setFilterStyle("brightness(1) contrast(1)"), 300);
        };

        let t = 0;

        const scheduleNextFlicker = (initialDelay: number) => {
            const randomDelay = Math.random() * (30000 - 5000) + 5000; // Random delay between 5 and 30 seconds
            t = setTimeout(() => {
                flicker();
                scheduleNextFlicker(randomDelay);
            }, initialDelay);
        };

        // Ensure the first flicker happens within the first 3 seconds
        scheduleNextFlicker(Math.random() * 2000 + 1000);

        return () => clearTimeout(t); // Cleanup any pending timeouts
    }, []);

    const handleStart = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }

        // Enable sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        onStart();
    };

    return (
        <div
            style={{
                backgroundImage: `url(${introImage})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                width: "100vw",
                height: "100vh",
                minHeight: "-webkit-fill-available", // iOS Safari fix
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-end",
                padding: "2rem",
                backdropFilter: "blur(5px)",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                filter: filterStyle, // Apply the flickering effect
                transition: "filter 0.3s ease-in-out", // Smooth transition for the flicker
            }}
        >
            <div
                style={{
                    marginLeft: "5rem",
                    marginBottom: "5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <span
                    onClick={handleStart}
                    style={{
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        color: "#fff",
                        textShadow: "1px 1px 2px black",
                        transition: "color 0.3s ease, text-shadow 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#ff0000";
                        e.currentTarget.style.textShadow = "2px 2px 5px red";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.textShadow = "1px 1px 2px black";
                    }}
                >
                    Start Game
                </span>
                <div
                    style={{
                        marginTop: "2rem",
                        padding: "1rem",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "#fff",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        textAlign: "center",
                        lineHeight: "1.5",
                    }}
                >
                    <strong>Controls:</strong>
                    <br />
                    WASD + Mouse to move
                    <br />E to interact
                </div>
            </div>
        </div>
    );
}

//------------------------------------------------------------------------------
function AppLayout() {
    const { instance } = useContext(LivelinkContext);
    const { entity: dialogueController } = useEntity({
        euid: "9ce50d52-db44-4c29-a1a6-9a4e84625390",
    });

    useEffect(() => {
        if (!dialogueController) {
            return;
        }

        function onStartDialogue(event: ScriptEventReceived) {
            console.log("Received start dialogue event", event);
        }

        dialogueController.addScriptEventListener({
            event_map_id: "eafb9834-194a-47cc-8a01-02d878e0cea9",
            event_name: "start_dialogue",
            onReceived: onStartDialogue,
        });
    }, [dialogueController]);

    useEffect(() => {
        if (!instance) {
            return;
        }

        async function instantiatePlayerSceneAndFindThirdPersonCamera(instance: LivelinkInstance) {
            const startingPointEntity = await instance.scene.findEntity({
                entity_uuid: startingPoint,
            });

            if (!startingPointEntity) {
                console.error("Starting point entity not found");
                return;
            }

            const playerSceneEntity = await instance.scene.newEntity({
                name: "PlayerSceneEntity",
                components: {
                    local_transform: {
                        position: startingPointEntity.global_transform.position,
                    },
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
        <Canvas width={"100vw"} height={"100vh"} style={{ minHeight: "-webkit-fill-available" }}>
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

        if (viewportDomElement.requestPointerLock) {
            viewportDomElement.requestPointerLock();
        }

        instance.devices.keyboard.enable();
        instance.devices.gamepad.enable();
        instance.devices.mouse.enableOnViewport({ viewport });

        instance.startSimulation();
    }, [instance, viewportDomElement]);

    useEffect(() => {
        if (document.fullscreenElement === null) {
            document.documentElement.requestFullscreen?.();
        }
    }, []);

    return null;
}
