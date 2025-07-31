import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Car,
  Camera,
  Cpu,
  Target,
} from "lucide-react";
import "./App.css";

const CarDetectionVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  const steps = [
    {
      title: "1. Original Video Stream",
      description: "High-resolution video from webcam (1920x1080)",
      color: "bg-blue-500",
    },
    {
      title: "2. Frame Capture & Resize",
      description: "Shrink to 320x240 for faster processing",
      color: "bg-green-500",
    },
    {
      title: "3. Car Detection AI",
      description: "COCO-SSD model finds cars with confidence scores",
      color: "bg-purple-500",
    },
    {
      title: "4. Car Region Extraction",
      description: "Crop out individual car areas",
      color: "bg-orange-500",
    },
    {
      title: "5. License Plate AI Prep",
      description: "Resize car region to 640x640 for plate model",
      color: "bg-red-500",
    },
    {
      title: "6. License Plate Detection",
      description: "Specialized AI finds plates within car region",
      color: "bg-cyan-500",
    },
    {
      title: "7. Coordinate Transformation",
      description: "Map results back to original video coordinates",
      color: "bg-yellow-500",
    },
    {
      title: "8. Final Display",
      description: "Show boxes around cars and license plates",
      color: "bg-pink-500",
    },
  ];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setAnimationProgress((prev) => {
          if (prev >= 100) {
            setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
            return 0;
          }
          return prev + 2;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const VideoFrame = ({ size, label, children, highlight }) => (
    <div
      className={`relative border-4 ${
        highlight ? "border-yellow-400 shadow-lg" : "border-gray-300"
      } bg-gray-800 rounded-lg transition-all duration-500`}
    >
      <div className="absolute -top-10 left-0 text-xs font-bold text-gray-600">
        {label}
      </div>
      <div
        className="relative bg-gradient-to-br from-sky-200 to-sky-400 rounded"
        style={{ width: size.width, height: size.height }}
      >
        {children}
      </div>
    </div>
  );

  const CarBox = ({
    x,
    y,
    width,
    height,
    color = "border-green-400",
    label,
  }) => (
    <div
      className={`absolute border-2 ${color} bg-transparent rounded`}
      style={{ left: x, top: y, width, height }}
    >
      {label && (
        <div className="absolute -top-5 left-0 text-xs bg-black text-white px-1 rounded">
          {label}
        </div>
      )}
    </div>
  );

  const PlateBox = ({ x, y, width, height }) => (
    <div
      className="absolute border-2 border-red-500 bg-red-500 bg-opacity-20 rounded"
      style={{ left: x, top: y, width, height }}
    >
      <div className="absolute -top-5 left-0 text-xs bg-red-500 text-white px-1 rounded">
        PLATE
      </div>
    </div>
  );

  const renderStepVisualization = () => {
    switch (currentStep) {
      case 0: // Original Video
        return (
          <div className="flex justify-center">
            <VideoFrame
              size={{ width: 320, height: 180 }}
              label="1920x1080 (scaled for display)"
              highlight={true}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Camera size={48} className="mx-auto mb-2 text-gray-700" />
                  <div className="text-sm font-bold text-gray-700">
                    Live Video Stream
                  </div>
                </div>
              </div>
              {/* Simulate cars in original video */}
              <CarBox
                x={50}
                y={80}
                width={80}
                height={40}
                color="border-blue-500"
                label="Car 1"
              />
              <CarBox
                x={180}
                y={100}
                width={70}
                height={35}
                color="border-blue-500"
                label="Car 2"
              />
            </VideoFrame>
          </div>
        );

      case 1: // Resize
        return (
          <div className="flex justify-center items-center space-x-8">
            <VideoFrame
              size={{ width: 320, height: 180 }}
              label="Original (1920x1080)"
            >
              <CarBox
                x={50}
                y={80}
                width={80}
                height={40}
                color="border-blue-500"
              />
              <CarBox
                x={180}
                y={100}
                width={70}
                height={35}
                color="border-blue-500"
              />
            </VideoFrame>
            <ChevronRight size={32} className="text-gray-400" />
            <VideoFrame
              size={{ width: 160, height: 90 }}
              label="Resized (320x240)"
              highlight={true}
            >
              <CarBox
                x={25}
                y={40}
                width={40}
                height={20}
                color="border-green-500"
              />
              <CarBox
                x={90}
                y={50}
                width={35}
                height={18}
                color="border-green-500"
              />
            </VideoFrame>
          </div>
        );

      case 2: // Car Detection
        return (
          <div className="flex justify-center">
            <VideoFrame
              size={{ width: 200, height: 120 }}
              label="AI Processing"
              highlight={true}
            >
              <div className="absolute top-2 right-2">
                <Cpu size={20} className="text-purple-500" />
              </div>
              <CarBox
                x={30}
                y={50}
                width={50}
                height={25}
                color="border-purple-500"
                label="Car: 85%"
              />
              <CarBox
                x={110}
                y={60}
                width={45}
                height={23}
                color="border-purple-500"
                label="Car: 92%"
              />

              {/* Scanning effect */}
              <div
                className="absolute top-0 left-0 w-full h-1 bg-purple-500 opacity-75 transition-all duration-1000"
                style={{ transform: `translateY(${animationProgress}px)` }}
              />
            </VideoFrame>
          </div>
        );

      case 3: // Car Region Extraction
        return (
          <div className="flex justify-center items-center space-x-4">
            <VideoFrame size={{ width: 160, height: 100 }} label="Full Frame">
              <CarBox
                x={20}
                y={40}
                width={40}
                height={20}
                color="border-orange-500"
              />
              <CarBox
                x={90}
                y={50}
                width={35}
                height={18}
                color="border-gray-400"
              />
            </VideoFrame>
            <ChevronRight size={24} className="text-gray-400" />
            <VideoFrame
              size={{ width: 80, height: 40 }}
              label="Extracted Car Region"
              highlight={true}
            >
              <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 rounded flex items-center justify-center">
                <Car size={24} className="text-orange-700" />
              </div>
            </VideoFrame>
          </div>
        );

      case 4: // License Plate AI Prep
        return (
          <div className="flex justify-center items-center space-x-4">
            <VideoFrame size={{ width: 80, height: 40 }} label="Car Region">
              <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 rounded">
                <Car
                  size={16}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-700"
                />
              </div>
            </VideoFrame>
            <ChevronRight size={24} className="text-gray-400" />
            <VideoFrame
              size={{ width: 120, height: 120 }}
              label="Resized to 640x640"
              highlight={true}
            >
              <div className="w-full h-full bg-gradient-to-br from-red-200 to-red-300 rounded flex items-center justify-center">
                <div className="text-center">
                  <Target size={32} className="mx-auto mb-1 text-red-700" />
                  <div className="text-xs text-red-700">Ready for AI</div>
                </div>
              </div>
            </VideoFrame>
          </div>
        );

      case 5: // License Plate Detection
        return (
          <div className="flex justify-center">
            <VideoFrame
              size={{ width: 150, height: 150 }}
              label="License Plate AI Scanning"
              highlight={true}
            >
              <div className="w-full h-full bg-gradient-to-br from-cyan-200 to-cyan-300 rounded relative">
                <div className="absolute top-2 right-2">
                  <Cpu size={20} className="text-cyan-700" />
                </div>
                <Car
                  size={40}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-cyan-700"
                />
                <PlateBox x={85} y={90} width={30} height={8} />

                {/* Scanning grid effect */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-30">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border border-cyan-500" />
                  ))}
                </div>
              </div>
            </VideoFrame>
          </div>
        );

      case 6: // Coordinate Transformation
        return (
          <div className="flex justify-center items-center space-x-2">
            <VideoFrame
              size={{ width: 80, height: 80 }}
              label="640x640 AI Result"
            >
              <PlateBox x={40} y={45} width={20} height={5} />
            </VideoFrame>
            <div className="flex flex-col items-center">
              <ChevronRight size={16} className="text-gray-400" />
              <div className="text-xs text-gray-500">Transform</div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            <VideoFrame size={{ width: 60, height: 30 }} label="Car Region">
              <PlateBox x={30} y={17} width={15} height={3} />
            </VideoFrame>
            <div className="flex flex-col items-center">
              <ChevronRight size={16} className="text-gray-400" />
              <div className="text-xs text-gray-500">Map Back</div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            <VideoFrame
              size={{ width: 200, height: 120 }}
              label="Original Video"
              highlight={true}
            >
              <CarBox
                x={30}
                y={50}
                width={50}
                height={25}
                color="border-yellow-500"
              />
              <PlateBox x={55} y={67} width={15} height={3} />
            </VideoFrame>
          </div>
        );

      case 7: // Final Display
        return (
          <div className="flex justify-center">
            <VideoFrame
              size={{ width: 300, height: 180 }}
              label="Final Result with UI Overlay"
              highlight={true}
            >
              <div className="w-full h-full relative">
                {/* Background cars */}
                <CarBox
                  x={40}
                  y={80}
                  width={80}
                  height={40}
                  color="border-green-400"
                  label="Car: 85%"
                />
                <CarBox
                  x={180}
                  y={100}
                  width={70}
                  height={35}
                  color="border-green-400"
                  label="Car: 92%"
                />

                {/* License plates */}
                <PlateBox x={70} y={97} width={20} height={6} />
                <PlateBox x={205} y={117} width={18} height={5} />

                {/* UI Elements */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  Cars Detected: 2 | Plates: 2
                </div>
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                  LIVE
                </div>
              </div>
            </VideoFrame>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Car Detection System Process
        </h1>
        <p className="text-gray-600">
          Interactive step-by-step visualization of how AI detects cars and
          license plates
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>
        <button
          onClick={() => {
            setCurrentStep(0);
            setAnimationProgress(0);
            setIsPlaying(false);
          }}
          className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentStep(index);
                setAnimationProgress(0);
                setIsPlaying(false);
              }}
              className={`w-4 h-4 rounded-full transition-all ${
                index === currentStep
                  ? "bg-blue-500 ring-4 ring-blue-200"
                  : index < currentStep
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Step Info */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {steps[currentStep].title}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {steps[currentStep].description}
        </p>
      </div>

      {/* Visualization Area */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 min-h-[300px] flex items-center justify-center">
        {renderStepVisualization()}
      </div>

      {/* Technical Details */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Technical Details for Current Step
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">
              What's Happening:
            </h4>
            <div className="text-sm text-gray-600">
              {currentStep === 0 &&
                "The system captures video frames from your webcam at full resolution. Each frame is like taking a photograph that will be analyzed."}
              {currentStep === 1 &&
                "To speed up processing, the system shrinks each frame to 320x240 pixels. This is like switching from a detailed photo to a thumbnail."}
              {currentStep === 2 &&
                "The COCO-SSD AI model scans the resized frame looking for objects. It's trained to recognize 80 different types of objects, including cars."}
              {currentStep === 3 &&
                "For each detected car, the system crops out just that rectangular region. This focuses the next AI model on just the car area."}
              {currentStep === 4 &&
                "The cropped car image is resized to exactly 640x640 pixels because the license plate AI was trained to expect this specific size."}
              {currentStep === 5 &&
                "A specialized MobileNet model scans the 640x640 car image looking for rectangular regions that look like license plates."}
              {currentStep === 6 &&
                "The trickiest part! The system converts coordinates from the AI's 640x640 space back through all the transformations to the original video coordinates."}
              {currentStep === 7 &&
                "Finally, the system draws colored boxes around detected cars (green) and license plates (red) on the original video display."}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">
              Key Technologies:
            </h4>
            <div className="text-sm text-gray-600">
              {currentStep === 0 &&
                "• HTML5 Canvas for video frame capture\n• WebRTC for camera access\n• Image scaling algorithms"}
              {currentStep === 1 &&
                "• Canvas 2D context for image manipulation\n• Bilinear interpolation for smooth resizing\n• Aspect ratio preservation"}
              {currentStep === 2 &&
                "• TensorFlow.js for browser-based AI\n• COCO-SSD pre-trained model\n• Non-Maximum Suppression for filtering"}
              {currentStep === 3 &&
                "• Canvas getImageData() for pixel extraction\n• Bounding box coordinate calculation\n• Image region cropping"}
              {currentStep === 4 &&
                "• TensorFlow tensor operations\n• Image resizing with tf.image.resizeBilinear\n• Data type conversion (float32 to int32)"}
              {currentStep === 5 &&
                "• Custom MobileNet architecture\n• Object detection with confidence scoring\n• Tensor array processing"}
              {currentStep === 6 &&
                "• Mathematical coordinate transformations\n• Scale factor calculations\n• Coordinate system mapping"}
              {currentStep === 7 &&
                "• Real-time rendering on HTML5 Canvas\n• UI overlay drawing\n• Performance optimization with RequestAnimationFrame"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetectionVisualization;
