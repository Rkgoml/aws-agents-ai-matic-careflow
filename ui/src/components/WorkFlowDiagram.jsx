// import React, { useEffect } from "react";
// import ReactFlow, {
//   Background,
//   Controls,
//   MiniMap,
//   useNodesState,
//   useEdgesState,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import { ChevronDown } from "lucide-react";
// const CustomNode = ({ data }) => {
//   const [isOpen, setIsOpen] = React.useState(false);

//   const getRandomColor = () => {
//     const colors = [
//       "#FFFAEB", // light yellow
//       "#FEF3C7", // light amber
//       "#E0F2FE", // light blue
//       "#ECFDF5", // mint green
//       "#FCE7F3", // pink
//       "#FEE2E2", // red-pastel
//       "#EDE9FE", // lavender
//       "#FFF7ED", // soft orange
//       "#FFF1F2", // soft rose
//       "#F0F9FF", // pale cyan
//       "#F3F4F6", // light gray
//       "#FDF2F8", // soft pink
//       "#EFF6FF", // baby blue
//     ];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };
//   const backgroundColor = getRandomColor();
//   const borderColor = "#00000033"; // optional, or generate another random

//   return (
//     <div
//       className="px-3 py-2 rounded-lg border-2 shadow-md cursor-pointer transition-all hover:shadow-lg"
//       style={{ background: backgroundColor, borderColor }}
//       onClick={() => setIsOpen(!isOpen)}
//     >
//       <div className="flex items-center justify-between gap-1">
//         <div>
//           <div className="font-semibold text-xs text-gray-900">
//             {data.agentName}
//           </div>
//           <div className="text-[10px] text-gray-600 font-mono">
//             {data.nodeId}
//           </div>
//         </div>
//         <ChevronDown
//           className={`w-3 h-3 transition-transform ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//       </div>

//       {isOpen && (
//         <div className="mt-2 pt-2 border-t border-gray-200 space-y-1 text-[10px]">
//           <p className="font-semibold text-gray-700">Task:</p>
//           <p className="text-gray-600 line-clamp-2">
//             {data.prompt?.substring(0, 100)}...
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default function WorkFlow({ workflowData }) {
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);

//   useEffect(() => {
//     if (!workflowData) return;

//     const newNodes = workflowData.nodes.map((node, index) => ({
//       id: node.node_id,
//       data: {
//         label: (
//           <CustomNode
//             data={{
//               agentName: node.agent_name,
//               nodeId: node.node_id,
//               prompt: node.agent_system_prompt,
//               randomColor:
//                 "#" + Math.floor(Math.random() * 16777215).toString(16),
//             }}
//           />
//         ),
//       },
//       position: { x: 50, y: index * 120 },
//       style: {
//         width: 260,
//         background: "transparent",
//         border: "none",
//       },
//     }));

//     const newEdges = workflowData.edges.map((edge) => ({
//       id: edge.id,
//       source: edge.from,
//       target: edge.to,
//       animated: true,
//       style: { stroke: "#6366F1", strokeWidth: 2 },
//       markerEnd: { type: "arrowclosed", color: "#6366F1" },
//     }));

//     setNodes(newNodes);
//     setEdges(newEdges);
//   }, [workflowData]);

//   return (
//     <div className="w-full h-[500px] bg-gray-50 rounded-lg shadow-inner p-2">
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         fitView
//       />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { ChevronDown } from "lucide-react";

import logo1 from "../assets/bot.png";
import logo2 from "../assets/db.png";
import logo3 from "../assets/bedrock.png";

const logos = [logo1, logo2, logo3];

const CustomNode = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getRandomColor = () => {
    const colors = [
      "#FFFAEB",
      "#FEF3C7",
      "#E0F2FE",
      "#ECFDF5",
      "#FCE7F3",
      "#FEE2E2",
      "#EDE9FE",
      "#FFF7ED",
      "#FFF1F2",
      "#F0F9FF",
      "#F3F4F6",
      "#FDF2F8",
      "#EFF6FF",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const backgroundColor = getRandomColor();
  const borderColor = "#00000033";

  return (
    <div
      className="rounded-lg border-2 shadow-md cursor-pointer transition-all hover:shadow-lg flex items-center gap-2 px-3 py-2"
      style={{
        background: backgroundColor,
        borderColor,
        width: 260,
        minHeight: 60,
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
        {data.logoIndex !== undefined && (
          <img
            src={logos[data.logoIndex % logos.length]}
            alt="logo"
            className="w-6 h-6"
          />
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        <div className="font-semibold text-xs text-gray-900 truncate">
          {data.agentName}
        </div>
        <div className="text-[10px] text-gray-600 font-mono truncate">
          {data.nodeId}
        </div>

        {isOpen && data.prompt && (
          <div className="mt-2 pt-2 border-t border-gray-200 space-y-1 text-[10px]">
            <p className="font-semibold text-gray-700">Task:</p>
            <p className="text-gray-600 line-clamp-2">
              {data.prompt?.substring(0, 100)}...
            </p>
          </div>
        )}
      </div>

      <ChevronDown
        className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </div>
  );
};

const WorkflowDiagram = ({ workflowData }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!workflowData) return;

    // Create creative left→right staggered layout
    const newNodes = workflowData.nodes.map((node, index) => ({
      id: node.node_id,
      data: {
        label: (
          <CustomNode
            data={{
              agentName: node.agent_name,
              nodeId: node.node_id,
              prompt: node.agent_system_prompt,
              randomColor: `#${Math.floor(Math.random() * 16777215).toString(
                16
              )}`,
              logoIndex: index,
            }}
          />
        ),
      },
      // Creative layout pattern: staggered y position with horizontal flow
      position: {
        x: index * 320,
        y: (index % 2 === 0 ? 100 : 250) + Math.random() * 30, // adds variation
      },
      style: {
        width: 260,
        background: "transparent",
        border: "none",
      },
    }));

    const newEdges = workflowData.edges.map((edge) => ({
      id: edge.id,
      source: edge.from,
      target: edge.to,
      animated: true,
      type: "smoothstep",
      style: { stroke: "#6366F1", strokeWidth: 2 },
      markerEnd: { type: "arrowclosed", color: "#6366F1" },
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [workflowData, setNodes, setEdges]);

  return (
    <div className="w-full h-[500px] bg-gray-50 rounded-lg shadow-inner p-2">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className="bg-black"
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default WorkflowDiagram;