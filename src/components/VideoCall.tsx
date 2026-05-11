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
        console.log("Initializing call with RoomID:", roomId);
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomId,
          userId,
          userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        console.log("ZegoUIKit instance created");

        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: !isAudioOnly,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          maxUsers: 2,
          onLeaveRoom: () => {
            if (onLeave) onLeave();
          },
        });
        console.log("Joined room successfully");
      } catch (err: any) {
        console.error("ZegoCloud error details:", err);
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
