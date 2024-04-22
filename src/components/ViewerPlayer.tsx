import {
  RoomAudioRenderer,
  useConnectionState,
  useRemoteParticipant,
  useRemoteParticipants,
  useTracks,
} from "@livekit/components-react";
import clsx from "clsx";
import {
  ConnectionState,
  Track,
  ParticipantEvent,
  ConnectionQuality,
} from "livekit-client";
import React, { useEffect, useMemo } from "react";

const ViewerPlayer = ({ moderator }: { moderator: string | undefined }) => {
  const stateConnection = useConnectionState();
  const participants = useRemoteParticipant(moderator ?? "", {
    updateOnlyOn: Object.values(ParticipantEvent),
  });

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
          <RoomAudioRenderer muted={false} />
        </div>
      </div>
    </>
  );
};

export default ViewerPlayer;
