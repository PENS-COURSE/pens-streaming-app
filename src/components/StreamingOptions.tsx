import { Dialog, Tab } from "@headlessui/react";
import React, { useState } from "react";
import TabItem from "./TabItem";
import clsx from "clsx";

interface StreamingOptionsProps {
  open: boolean;
  onClose: () => void;
  deviceList: {
    audioinput?: MediaDeviceInfo[];
    audiooutput?: MediaDeviceInfo[];
    videoinput?: MediaDeviceInfo[];
  };
  device: {
    audioinput?: MediaDeviceInfo | null;
    audiooutput?: MediaDeviceInfo | null;
    videoinput?: MediaDeviceInfo | null;
  };
  handleDeviceChange: (
    type: "audioinput" | "audiooutput" | "videoinput",
    deviceId: string
  ) => void;
}

const StreamingOptions = ({
  open,
  onClose,
  deviceList,
  device,
  handleDeviceChange,
}: StreamingOptionsProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="mx-auto max-w-2xl max-h-96 rounded bg-black w-full h-full">
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <div className="grid grid-cols-3 text-white h-full">
              <div className="col-span-1 border-r py-3">
                <h1 className="text-lg font-semibold mb-5 px-6">Pengaturan</h1>
                <Tab.List className="flex flex-col items-start">
                  <TabItem
                    active={selectedIndex === 0}
                    hidden={
                      deviceList.audioinput === null ||
                      deviceList.audiooutput === null
                    }
                  >
                    Audio
                  </TabItem>
                  <TabItem
                    active={selectedIndex === 1}
                    hidden={deviceList.videoinput === undefined}
                  >
                    Video
                  </TabItem>
                </Tab.List>
              </div>
              <div className="col-span-2 py-3 w-full">
                <button
                  onClick={onClose}
                  className="text-lg font-semibold block ml-auto mr-5 rounded bg-gray-600 px-2"
                >
                  <h1>X</h1>
                </button>

                <Tab.Panels className="px-5 h-full">
                  {deviceList.audioinput || deviceList.audiooutput ? (
                    <Tab.Panel>
                      {deviceList.audioinput && (
                        <>
                          <h1 className="text-gray-100 text-lg font-medium">
                            Audio Input (Microphone)
                          </h1>
                          <div className="border-b border-white my-3"></div>
                          <select
                            className="select select-bordered w-full max-w-xs"
                            onChange={(e) =>
                              handleDeviceChange("audioinput", e.target.value)
                            }
                            value={device.audioinput?.deviceId || "default"}
                          >
                            {deviceList.audioinput &&
                              deviceList.audioinput.map((device) => (
                                <option
                                  key={device.deviceId}
                                  value={device.deviceId}
                                >
                                  {device.label}
                                </option>
                              ))}
                          </select>
                        </>
                      )}

                      {deviceList.audiooutput && (
                        <>
                          <h1
                            className={clsx(
                              "text-gray-100 text-lg font-medium",
                              {
                                "mt-10": deviceList.audioinput,
                              }
                            )}
                          >
                            Audio Output (Speaker)
                          </h1>
                          <div className="border-b border-white my-3"></div>
                          <select
                            className="select select-bordered w-full max-w-xs"
                            onChange={(e) =>
                              handleDeviceChange("audiooutput", e.target.value)
                            }
                            value={device.audiooutput?.deviceId || "default"}
                          >
                            {deviceList.audiooutput &&
                              deviceList.audiooutput.map((device) => (
                                <option
                                  key={device.deviceId}
                                  value={device.deviceId}
                                >
                                  {device.label}
                                </option>
                              ))}
                          </select>
                        </>
                      )}
                    </Tab.Panel>
                  ) : null}
                  {deviceList.videoinput && (
                    <>
                      <Tab.Panel>
                        <h1 className="text-gray-100 text-lg font-medium">
                          Camera
                        </h1>
                        <div className="border-b border-white my-3"></div>
                        <select
                          className="select select-bordered w-full max-w-xs"
                          onChange={(e) =>
                            handleDeviceChange("videoinput", e.target.value)
                          }
                          value={device.videoinput?.deviceId || "default"}
                        >
                          {deviceList.videoinput &&
                            deviceList.videoinput.map((device) => (
                              <option
                                key={device.deviceId}
                                value={device.deviceId}
                              >
                                {device.label}
                              </option>
                            ))}
                        </select>
                      </Tab.Panel>
                    </>
                  )}
                </Tab.Panels>
              </div>
            </div>
          </Tab.Group>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default StreamingOptions;
