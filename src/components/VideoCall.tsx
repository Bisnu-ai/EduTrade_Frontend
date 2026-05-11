"use client";

import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

interface VideoCallProps {
  roomId: string;
  userId: string;
  userName: string;
  isAudioOnly?: boolean;
  onLeave?: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ 
  roomId, 
  userId, 
  userName, 
  isAudioOnly = false,
  onLeave 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";

    if (!appID || !serverSecret) {
      console.error("ZegoCloud credentials missing");
      return;
    }

    const initMeeting = async () => {
      try {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomId,
          userId,
          userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: isAudioOnly 
              ? ZegoUIKitPrebuilt.OneONOneCall 
              : ZegoUIKitPrebuilt.OneONOneCall, // UI Kit handles both
          },
          showScreenSharingButton: false,
          turnOnCameraWhenJoining: !isAudioOnly,
          turnOnMicrophoneWhenJoining: true,
          showMyCameraToggleButton: !isAudioOnly,
          showAudioVideoSettingsButton: true,
          onLeaveRoom: () => {
            if (onLeave) onLeave();
          },
        });
      } catch (err) {
        console.error("ZegoCloud initialization error:", err);
      }
    };

    initMeeting();

    return () => {
      // Cleanup logic if needed (ZegoCloud usually handles its own instance)
    };
  }, [roomId, userId, userName, isAudioOnly, onLeave]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-black z-[100]" 
      style={{ height: "100vh" }} 
    />
  );
};

export default VideoCall;
