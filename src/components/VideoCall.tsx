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
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: !isAudioOnly,
          showMyCameraToggleButton: !isAudioOnly,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          maxUsers: 2,
          layout: "Auto",
          showLayoutButton: false,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
            config: {
              role: ZegoUIKitPrebuilt.Host,
            },
          },
          onLeaveRoom: () => {
            if (onLeave) onLeave();
          },
        });
      } catch (err: any) {
        console.error("ZegoCloud initialization error:", err);
        // Inform user about common issues
        if (err.message?.includes("NotReadableError") || err.extendedData?.includes("NotReadableError")) {
          alert("Camera/Microphone is already in use by another app. Please close other apps and try again.");
        } else {
          alert("Failed to start call. Please check your camera/mic permissions.");
        }
        if (onLeave) onLeave();
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
