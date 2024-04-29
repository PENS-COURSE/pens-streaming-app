import {
  RoomAudioRenderer,
  TrackMutedIndicator,
  useConnectionState,
  useRemoteParticipant,
  useRemoteParticipants,
  useTracks,
  useMediaDeviceSelect,
} from "@livekit/components-react";
import clsx from "clsx";
import {
  ConnectionState,
  Track,
  RoomEvent,
  ConnectionQuality,
} from "livekit-client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import StreamingOptions from "./StreamingOptions";
import { IconGear } from "@irsyadadl/paranoid";

const ViewerPlayer = ({ moderator }: { moderator: string | undefined }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    devices: audioOutputDevices,
    activeDeviceId: activeAudioOutputDeviceId,
    setActiveMediaDevice: setActiveAudioOutputDevice,
  } = useMediaDeviceSelect({
    kind: "audiooutput",
  });

  const [deviceList, setDeviceList] = useState<
    Record<"audiooutput", MediaDeviceInfo[]>
  >({
    audiooutput: [],
  });

  const [device, setDevice] = useState<
    Record<"audiooutput", MediaDeviceInfo | null>
  >({
    audiooutput: null,
  });

  const stateConnection = useConnectionState();
  const participants = useRemoteParticipants({
    updateOnlyOn: Object.values(RoomEvent),
  }).filter((p) => p.permissions?.canPublishSources)[0];

  const videoEl = React.useRef<HTMLVideoElement>(null);
  const shareScreenEl = React.useRef<HTMLVideoElement>(null);

  useTracks(Object.values(Track.Source), {})
    .filter((track) => track.participant.permissions)
    .forEach((track) => {
      switch (track.source) {
        case Track.Source.Camera:
          if (videoEl.current) {
            track.publication.track?.attach(videoEl.current);
          }
          break;
        case Track.Source.Microphone:
          if (videoEl.current) {
            track.publication.track?.attach(videoEl.current);
            videoEl.current.muted = false;
          }
          break;
        case Track.Source.ScreenShare || Track.Source.ScreenShareAudio:
          if (shareScreenEl.current) {
            track.publication.track?.attach(shareScreenEl.current);
            shareScreenEl.current.muted = false;
          }
          break;
      }
    });

  const isShareScreen = useMemo(
    () => participants?.isScreenShareEnabled,
    [participants?.isScreenShareEnabled]
  );

  const isCameraEnabled = useMemo(
    () => participants?.isCameraEnabled,
    [participants?.isCameraEnabled]
  );

  const isMicrophoneEnabled = useMemo(
    () => participants?.isMicrophoneEnabled,
    [participants?.isMicrophoneEnabled]
  );

  const gotDevices = useCallback(async () => {
    setDeviceList({
      audiooutput: audioOutputDevices,
    });
  }, [audioOutputDevices]);

  const handleDeviceChange = useCallback(
    async (
      kind: "audioinput" | "audiooutput" | "videoinput",
      deviceId: string
    ) => {
      const device = deviceList["audiooutput"].find(
        (device) => device.deviceId === deviceId
      );

      if (device) {
        setActiveAudioOutputDevice(device.deviceId);
        setDevice((prevDevice) => ({
          ...prevDevice,
          [kind]: device,
        }));
      }
    },
    [deviceList, setActiveAudioOutputDevice]
  );

  useEffect(() => {
    gotDevices();
  }, [gotDevices]);

  if (
    stateConnection === ConnectionState.Connecting ||
    ConnectionState.Reconnecting
  ) {
    <div className="aspect-video w-full h-auto mt-10 rounded overflow-hidden">
      <main className="bg-black flex items-center w-full h-full justify-center select-none">
        <svg className="spinner-ring" viewBox="25 25 50 50" strokeWidth="5">
          <circle cx="50" cy="50" r="20" />
        </svg>
      </main>
    </div>;
  }

  if (
    stateConnection === ConnectionState.Disconnected ||
    !participants ||
    participants.connectionQuality === ConnectionQuality.Unknown
  ) {
    return (
      <div className="aspect-video w-full h-auto mt-10 rounded overflow-hidden">
        <main className="bg-black flex items-center w-full h-full justify-center select-none text-white">
          <h1 className="text-lg">Host Tidak Ada atau Sedang Offline</h1>
        </main>
      </div>
    );
  }

  if (isMicrophoneEnabled && !isCameraEnabled) {
    return (
      <div className="aspect-video w-full h-auto mt-10 rounded overflow-hidden">
        <main className="bg-black flex items-center w-full h-full justify-center select-none text-white">
          <h1 className="text-lg">
            {participants?.identity} Sedang Aktifkan Microphone
          </h1>
        </main>
      </div>
    );
  }

  if (!isShareScreen && !isCameraEnabled && !isMicrophoneEnabled) {
    return (
      <div className="aspect-video w-full h-auto mt-10 rounded overflow-hidden">
        <main className="bg-black flex items-center w-full h-full justify-center select-none text-white">
          <h1 className="text-lg">
            Host Sedang Tidak Aktifkan Kamera atau Share Screen
          </h1>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="aspect-video w-full h-auto mt-10 rounded overflow-hidden">
        <div className="relative">
          <video
            className={clsx("object-cover w-full h-full", {
              hidden: !isShareScreen,
            })}
            ref={shareScreenEl}
            autoPlay
          ></video>
          <video
            className={clsx(
              "object-cover",
              isShareScreen
                ? "absolute z-10 aspect-video w-60 right-5 bottom-20 rounded-md"
                : "w-full h-full",
              {
                hidden: !isCameraEnabled,
              }
            )}
            ref={videoEl}
            autoPlay
          ></video>
          <RoomAudioRenderer muted={false} volume={100} />
        </div>
      </div>

      <button
        className="btn btn-sm text-white text-sm w-56 h-10 mt-5"
        onClick={() => setIsModalOpen(true)}
      >
        <IconGear />
        <h1>Pengaturan</h1>
      </button>

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

export default ViewerPlayer;
