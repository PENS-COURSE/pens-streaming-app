import {
  IconCamera,
  IconCameraOff,
  IconCirclePlay,
  IconCircleStop,
  IconGear,
  IconMic,
  IconMicOff,
  IconRecord,
} from "@irsyadadl/paranoid";
import {
  useLocalParticipant,
  useMediaDeviceSelect,
} from "@livekit/components-react";
import clsx from "clsx";
import {
  createLocalAudioTrack,
  createLocalVideoTrack,
  LocalTrack,
  Track,
} from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  startRecordStreaming,
  stopRecordStreaming,
} from "../actions/streaming";
import ButtonToggle from "./ButtonToggle";
import StreamingOptions from "./StreamingOptions";

const HostPlayer = ({ roomSlug }: { roomSlug: string }) => {
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [videoTrack, setVideoTrack] = useState<LocalTrack>();
  const [audioTrack, setAudioTrack] = useState<LocalTrack>();
  const [screenTrack, setScreenTrack] = useState<LocalTrack[]>();
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState({
    path: null,
    isRecording: false,
    isLoading: false,
  });

  const [deviceList, setDeviceList] = useState<
    Record<"audioinput" | "audiooutput" | "videoinput", MediaDeviceInfo[]>
  >({
    audioinput: [],
    audiooutput: [],
    videoinput: [],
  });

  const [device, setDevice] = useState<
    Record<"audioinput" | "audiooutput" | "videoinput", MediaDeviceInfo | null>
  >({
    audioinput: null,
    audiooutput: null,
    videoinput: null,
  });

  const {
    devices: audioOutputDevices,
    activeDeviceId: activeAudioOutputDeviceId,
    setActiveMediaDevice: setActiveAudioOutputDevice,
  } = useMediaDeviceSelect({
    kind: "audiooutput",
  });

  const {
    devices: audioInputDevices,
    activeDeviceId: activeAudioInputDeviceId,
    setActiveMediaDevice: setActiveAudioInputDevice,
  } = useMediaDeviceSelect({
    kind: "audioinput",
  });

  const {
    devices: videoInputDevices,
    activeDeviceId: activeVideoInputDeviceId,
    setActiveMediaDevice: setActiveVideoInputDevice,
  } = useMediaDeviceSelect({
    kind: "videoinput",
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { localParticipant } = useLocalParticipant();

  const previewVideoEl = useRef<HTMLVideoElement>(null);
  const shareScreenEl = useRef<HTMLVideoElement>(null);

  const toggleStreaming = useCallback(() => {
    if (isStreaming && localParticipant) {
      if (videoTrack) {
        void localParticipant.unpublishTrack(videoTrack);
      }
      if (audioTrack) {
        void localParticipant.unpublishTrack(audioTrack);
      }
      if (screenTrack) {
        screenTrack.forEach((track) => {
          void localParticipant.unpublishTrack(track);
        });
      }
    } else {
      if (videoTrack) {
        void localParticipant?.publishTrack(videoTrack);
      }

      if (audioTrack) {
        void localParticipant?.publishTrack(audioTrack);
      }

      if (screenTrack) {
        screenTrack.forEach((track) => {
          void localParticipant?.publishTrack(track);
        });
      }
    }

    setIsStreaming(!isStreaming);
  }, [isStreaming, localParticipant, videoTrack, audioTrack, screenTrack]);

  const toggleCamera = useCallback(async () => {
    if (isCameraOn) {
      videoTrack?.stop();
      if (videoTrack && isStreaming) {
        void localParticipant.unpublishTrack(videoTrack);
      }
      setVideoTrack(undefined);
    } else {
      const tracks = await createLocalVideoTrack({
        deviceId: activeVideoInputDeviceId,
      });
      setVideoTrack(tracks);
      if (isStreaming) {
        void localParticipant?.publishTrack(tracks);
      }

      if (previewVideoEl.current) {
        tracks.attach(previewVideoEl.current);
      }
    }

    if (isStreaming) localParticipant?.setCameraEnabled(!isCameraOn);
    setIsCameraOn(!isCameraOn);
  }, [
    isCameraOn,
    isStreaming,
    localParticipant,
    videoTrack,
    activeVideoInputDeviceId,
  ]);

  const toggleMicrophone = useCallback(async () => {
    if (isMicrophoneOn) {
      audioTrack?.stop();
      if (audioTrack && isStreaming) {
        void localParticipant?.unpublishTrack(audioTrack);
      }
      setAudioTrack(undefined);
    } else {
      const tracks = await createLocalAudioTrack({
        deviceId: activeAudioInputDeviceId,
      });
      setAudioTrack(tracks);

      if (isStreaming) {
        void localParticipant?.publishTrack(tracks);
      }
    }

    if (isStreaming) localParticipant?.setMicrophoneEnabled(!isMicrophoneOn);
    setIsMicrophoneOn(!isMicrophoneOn);
  }, [
    isMicrophoneOn,
    isStreaming,
    localParticipant,
    audioTrack,
    activeAudioInputDeviceId,
  ]);

  const toggleShareScreen = useCallback(async () => {
    if (isScreenSharing) {
      localParticipant?.setScreenShareEnabled(false);

      setScreenTrack(undefined);
      if (shareScreenEl.current) {
        const mediaStream = shareScreenEl.current?.srcObject as MediaStream;

        mediaStream.getTracks().forEach((track) => {
          track.stop();
          mediaStream.removeTrack(track);
        });
      }
    } else {
      const tracks = await localParticipant?.createScreenTracks({
        audio: true,
      });
      setScreenTrack(tracks);

      if (shareScreenEl.current) {
        tracks
          ?.filter(
            (track) =>
              track.source === Track.Source.ScreenShare ||
              Track.Source.ScreenShareAudio
          )
          .forEach((track) => {
            if (shareScreenEl.current) {
              track.on("ended", () => {
                localParticipant?.setScreenShareEnabled(false);
                void localParticipant.unpublishTrack(track);
                setIsScreenSharing(false);
              });

              void localParticipant?.publishTrack(track);
              track.attach(shareScreenEl.current);
            }
          });
      }
    }

    setIsScreenSharing(!isScreenSharing);
  }, [isScreenSharing, localParticipant]);

  const handleRecording = useCallback(async () => {
    try {
      console.log("isRecording :", isRecording);
      setIsRecording({ ...isRecording, isLoading: true });

      if (isRecording.isRecording) {
        const data = await stopRecordStreaming({
          slug: roomSlug,
        });

        if (data) {
          console.log("data record :", data);
          console.log("Recording stopped");
          setIsRecording({
            ...isRecording,
            isRecording: false,
            isLoading: false,
            path: data.data.path,
          });
        }
      } else {
        const data = await startRecordStreaming({
          slug: roomSlug,
        });

        if (data) {
          console.log("data record :", data);
          console.log("Recording started");
          setIsRecording({
            ...isRecording,
            isRecording: true,
            isLoading: false,
          });
        }
      }
    } catch (error) {
      setIsRecording({
        ...isRecording,
        isRecording: false,
      });

      console.error(error);
    }

    console.log("isRecording :", isRecording);
  }, [isRecording, roomSlug]);

  const gotDevices = useCallback(async () => {
    setDeviceList({
      audioinput: audioInputDevices,
      audiooutput: audioOutputDevices,
      videoinput: videoInputDevices,
    });
  }, [audioInputDevices, audioOutputDevices, videoInputDevices]);

  const handleDeviceChange = useCallback(
    async (
      kind: "audioinput" | "audiooutput" | "videoinput",
      deviceId: string
    ) => {
      const device = deviceList[kind].find(
        (device) => device.deviceId === deviceId
      );

      if (device) {
        setDevice((prevDevice) => ({
          ...prevDevice,
          [kind]: device,
        }));

        if (kind === "audioinput") {
          setActiveAudioInputDevice(device.deviceId);
        }

        if (kind === "videoinput") {
          setActiveVideoInputDevice(device.deviceId);
        }

        if (kind === "audiooutput") {
          setActiveAudioOutputDevice(device.deviceId);
        }
      }
    },
    [
      deviceList,
      setActiveAudioInputDevice,
      setActiveAudioOutputDevice,
      setActiveVideoInputDevice,
    ]
  );

  useEffect(() => {
    gotDevices();
  }, [gotDevices]);

  return (
    <>
      <div className="aspect-video w-full h-auto mt-10 rounded overflow-hidden relative">
        <div className="">
          <video
            className={clsx("object-cover w-full h-full", {
              hidden: !isScreenSharing,
            })}
            ref={shareScreenEl}
          ></video>
          <video
            className={clsx(
              "object-cover absolute transition-all w-full duration-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 video__camera",
              isScreenSharing
                ? "z-10 aspect-video !w-60 rounded-md !right-10 !bottom-10 translate-x-1/3 translate-y-1/3 xl:!translate-x-full xl:!translate-y-full"
                : "video__camera--full",
              {
                hidden: !isCameraOn,
              }
            )}
            ref={previewVideoEl}
          ></video>
        </div>
        {!videoTrack && (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <h1 className="text-white text-center">
              Kamera belum dinyalakan, silahkan nyalakan kamera terlebih dahulu
            </h1>
          </div>
        )}
      </div>
      <div className="my-5">
        <div className="flex items-center flex-wrap w-auto gap-3">
          <ButtonToggle
            value={isStreaming}
            onClick={toggleStreaming}
            className="flex items-center gap-x-2"
          >
            {isStreaming ? <IconCircleStop /> : <IconCirclePlay />}
            {isStreaming ? "Matikan Streaming" : "Mulai Streaming"}
          </ButtonToggle>
          <ButtonToggle
            value={isScreenSharing}
            onClick={toggleShareScreen}
            className="flex items-center gap-x-2"
            hidden={!isStreaming}
          >
            {isScreenSharing ? <IconCamera /> : <IconCameraOff />}
            {isScreenSharing ? "Matikan Share Screen" : "Share Screen"}
          </ButtonToggle>
          <ButtonToggle
            value={isCameraOn}
            onClick={toggleCamera}
            className="flex items-center gap-x-2"
          >
            {isCameraOn ? <IconCamera /> : <IconCameraOff />}
            {isCameraOn ? "Matikan Kamera" : "Nyalakan Kamera"}
          </ButtonToggle>
          <ButtonToggle
            value={isMicrophoneOn}
            onClick={toggleMicrophone}
            className="flex items-center gap-x-2"
          >
            {isMicrophoneOn ? <IconMic /> : <IconMicOff />}
            {isMicrophoneOn ? "Matikan Mic" : "Nyalakan Mic"}
          </ButtonToggle>
          <ButtonToggle
            value={isRecording.isRecording}
            onClick={handleRecording}
            className="flex items-center gap-x-2"
            disabled={isRecording.isLoading || !isStreaming}
            hidden={!isStreaming}
          >
            {isRecording.isRecording ? <IconCircleStop /> : <IconRecord />}
            {isRecording.isRecording ? "Hentikan Rekam" : "Rekam Sesi"}
          </ButtonToggle>
          <button
            className="btn btn-sm text-white text-sm w-56 h-10"
            onClick={() => setIsModalOpen(true)}
          >
            <IconGear />
            <h1>Pengaturan</h1>
          </button>
        </div>
      </div>

      {isRecording.path && (
        <div className="flex items-center gap-2">
          <p>Lihat Hasil Rekaman :</p>
          <a
            href={`http://localhost:5000/${isRecording.path}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:text-blue-600 transition-colors duration-300"
          >
            Download Rekaman
          </a>
        </div>
      )}
      {createPortal(
        <StreamingOptions
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          device={device}
          deviceList={deviceList}
          handleDeviceChange={handleDeviceChange}
        />,
        document.body
      )}
    </>
  );
};

export default HostPlayer;
