import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Database,
  Brain,
  TrendingUp,
  FileText,
} from "lucide-react";

export default function WorkflowDiagram() {
  const [expandedNode, setExpandedNode] = useState(null);
  const workflowData = {
    workflow_name: "missed_appointments_financial_impact_analysis",
    description:
      "Estimate the financial impact of missed appointments across three entities (Hospital, Insurance, TPA) using industry averages",
    graph_type: "sequential",
    nodes: [
      {
        node_id: "retrieve-appointment-data",
        agent_name: "AppointmentDataRetriever",
        agent_system_prompt:
          "Retrieve comprehensive appointment data with missed appointment statistics. Use the custom_query tool with the provided connection_id to fetch: 1) Total appointment volume over a specified time period, 2) Status indicators for kept vs. missed appointments, 3) Missed appointment rates by department/specialty, 4) Temporal patterns of missed appointments (day of week, time of day, seasonality). Format the output as a structured dataset that clearly shows the scope and patterns of missed appointments.",
        inputs: { connection_id: "{{workflow.inputs.connection_id}}" },
        outputs: {
          appointment_data:
            "Dataset showing appointment volume and missed appointment rates with temporal and departmental breakdowns",
        },
      },
      {
        node_id: "gather-procedure-visit-data",
        agent_name: "ProcedureVisitDataCollector",
        agent_system_prompt:
          "Gather detailed procedure and visit type information for missed appointments. Use the custom_query tool with the provided connection_id to: 1) Categorize missed appointments by procedure/visit type, 2) Collect CPT/billing codes associated with missed appointments, 3) Identify the complexity level of missed procedures/visits, 4) Determine if appointments were new patient or follow-up visits. Organize this data to enable accurate financial impact assessment based on procedure/visit types.",
        inputs: {
          connection_id: "{{workflow.inputs.connection_id}}",
          appointment_data:
            "{{nodes.retrieve-appointment-data.outputs.appointment_data}}",
        },
        outputs: {
          procedure_visit_data:
            "Categorized data of missed appointments by procedure/visit type with associated billing codes and complexity levels",
        },
      },
      {
        node_id: "retrieve-cost-data",
        agent_name: "CostDataRetriever",
        agent_system_prompt:
          "Retrieve industry average costs by procedure/visit type. Use the custom_query tool with the provided connection_id to fetch: 1) Average reimbursement rates for each procedure/visit type identified in the missed appointments, 2) Standard costs for hospital resources allocated to these appointment types, 3) Administrative costs associated with scheduling and processing appointments, 4) Industry benchmarks for financial impacts of missed appointments. Ensure the cost data is comprehensive and aligned with the procedure/visit types in the dataset.",
        inputs: {
          connection_id: "{{workflow.inputs.connection_id}}",
          procedure_visit_data:
            "{{nodes.gather-procedure-visit-data.outputs.procedure_visit_data}}",
        },
        outputs: {
          cost_reference_data:
            "Cost reference data for each procedure/visit type including reimbursement rates and resource costs",
        },
      },
      {
        node_id: "calculate-financial-impacts",
        agent_name: "FinancialImpactCalculator",
        agent_system_prompt:
          "Calculate the financial impact of missed appointments across all three entities (Hospital, Insurance, TPA). Use the custom_query tool with the provided connection_id to: 1) Calculate direct hospital revenue loss based on missed appointments and their associated costs, 2) Estimate the financial impact on insurance entities including administrative costs and inefficient resource allocation, 3) Calculate the impact on Third Party Administrators (TPAs) through processing costs and operational inefficiencies, 4) Determine the total estimated cost across all entities. Provide detailed calculations showing how each impact figure was derived.",
        inputs: {
          connection_id: "{{workflow.inputs.connection_id}}",
          appointment_data:
            "{{nodes.retrieve-appointment-data.outputs.appointment_data}}",
          procedure_visit_data:
            "{{nodes.gather-procedure-visit-data.outputs.procedure_visit_data}}",
          cost_reference_data:
            "{{nodes.retrieve-cost-data.outputs.cost_reference_data}}",
        },
        outputs: {
          hospital_impact:
            "Estimated direct financial impact on hospital from missed appointments",
          insurance_impact: "Estimated financial impact on insurance entities",
          tpa_impact:
            "Estimated financial impact on Third Party Administrators",
          total_impact: "Total estimated cost across all entities",
        },
      },
      {
        node_id: "analyze-financial-patterns",
        agent_name: "FinancialPatternAnalyzer",
        agent_system_prompt:
          "Analyze patterns and trends in the financial impact data. Examine: 1) Which procedure/visit types contribute most significantly to financial losses, 2) Temporal patterns showing when financial impacts are highest, 3) Departmental/specialty areas with the greatest financial exposure from missed appointments, 4) Potential annual impact projections based on current missed appointment rates. Look for correlations between missed appointment rates and specific factors that might suggest targeted intervention opportunities.",
        inputs: {
          appointment_data:
            "{{nodes.retrieve-appointment-data.outputs.appointment_data}}",
          procedure_visit_data:
            "{{nodes.gather-procedure-visit-data.outputs.procedure_visit_data}}",
          hospital_impact:
            "{{nodes.calculate-financial-impacts.outputs.hospital_impact}}",
          insurance_impact:
            "{{nodes.calculate-financial-impacts.outputs.insurance_impact}}",
          tpa_impact:
            "{{nodes.calculate-financial-impacts.outputs.tpa_impact}}",
          total_impact:
            "{{nodes.calculate-financial-impacts.outputs.total_impact}}",
        },
        outputs: {
          financial_analysis:
            "Analysis of financial impact patterns by procedure type, time period, and department",
        },
      },
      {
        node_id: "final_result",
        agent_name: "FinancialImpactReportGenerator",
        agent_system_prompt:
          "Generate a comprehensive financial impact report on missed appointments. The report should include: 1) Executive summary with key findings, 2) Overall missed appointment statistics and trends, 3) Direct revenue loss to the hospital with breakdown by department/specialty, 4) Financial impact on insurance entities with specific cost categories, 5) Financial impact on TPAs with breakdown of administrative costs, 6) Total estimated cost across all entities, 7) Cost breakdown by procedure/visit type highlighting highest impact areas, 8) Potential annual impact based on current missed appointment rates, 9) Recommendations for targeted interventions to reduce financial impact. Format the report professionally with clear sections, data visualizations, and actionable insights.",
        inputs: {
          appointment_data:
            "{{nodes.retrieve-appointment-data.outputs.appointment_data}}",
          procedure_visit_data:
            "{{nodes.gather-procedure-visit-data.outputs.procedure_visit_data}}",
          hospital_impact:
            "{{nodes.calculate-financial-impacts.outputs.hospital_impact}}",
          insurance_impact:
            "{{nodes.calculate-financial-impacts.outputs.insurance_impact}}",
          tpa_impact:
            "{{nodes.calculate-financial-impacts.outputs.tpa_impact}}",
          total_impact:
            "{{nodes.calculate-financial-impacts.outputs.total_impact}}",
          financial_analysis:
            "{{nodes.analyze-financial-patterns.outputs.financial_analysis}}",
        },
        outputs: {
          financial_impact_report:
            "Comprehensive report showing total estimated costs of missed appointments across all three entities with detailed breakdowns and analysis",
        },
      },
    ],
    edges: [
      {
        id: "edge_1",
        from: "retrieve-appointment-data",
        to: "gather-procedure-visit-data",
      },
      {
        id: "edge_2",
        from: "gather-procedure-visit-data",
        to: "retrieve-cost-data",
      },
      {
        id: "edge_3",
        from: "retrieve-cost-data",
        to: "calculate-financial-impacts",
      },
      {
        id: "edge_4",
        from: "calculate-financial-impacts",
        to: "analyze-financial-patterns",
      },
      { id: "edge_5", from: "analyze-financial-patterns", to: "final_result" },
    ],
    entry_point: "retrieve-appointment-data",
    exit_point: "final_result",
    workflow_inputs: {
      connection_id:
        "Database connection identifier for accessing appointment and financial data",
    },
    workflow_outputs: {
      financial_impact_report:
        "Comprehensive financial impact report showing the costs of missed appointments across hospital, insurance, and TPA entities",
    },
  };

  const getNodeColor = (agentName) => {
    if (agentName.includes("Retriever")) return "bg-blue-100 border-blue-300";
    if (agentName.includes("Collector"))
      return "bg-purple-100 border-purple-300";
    if (agentName.includes("Calculator"))
      return "bg-green-100 border-green-300";
    if (agentName.includes("Analyzer"))
      return "bg-yellow-100 border-yellow-300";
    if (agentName.includes("Generator")) return "bg-red-100 border-red-300";
    return "bg-gray-100 border-gray-300";
  };

  const getNodeIcon = (agentName) => {
    if (agentName.includes("Retriever"))
      return <Database className="w-5 h-5 text-blue-600" />;
    if (agentName.includes("Collector"))
      return <Database className="w-5 h-5 text-purple-600" />;
    if (agentName.includes("Calculator"))
      return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (agentName.includes("Analyzer"))
      return <TrendingUp className="w-5 h-5 text-yellow-600" />;
    if (agentName.includes("Generator"))
      return <FileText className="w-5 h-5 text-red-600" />;
    return <Brain className="w-5 h-5 text-gray-600" />;
  };

  const toggleNode = (nodeId) => {
    setExpandedNode(expandedNode === nodeId ? null : nodeId);
  };

  const getNextNode = (currentNodeId) => {
    const edge = workflowData.edges.find((e) => e.from === currentNodeId);
    return edge ? edge.to : null;
  };

  const currentNodeIndex = workflowData.nodes.findIndex(
    (n) => n.node_id === workflowData.entry_point
  );

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {workflowData.workflow_name}
          </h1>
          <p className="text-gray-600">{workflowData.description}</p>
        </div>

        {/* Workflow Diagram */}
        <div className="space-y-4">
          {workflowData.nodes.map((node, index) => {
            const isExpanded = expandedNode === node.node_id;
            const nextNodeId = getNextNode(node.node_id);
            const isLastNode = index === workflowData.nodes.length - 1;

            return (
              <div key={node.node_id}>
                {/* Node */}
                <div
                  className={`${getNodeColor(
                    node.agent_name
                  )} border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg`}
                  onClick={() => toggleNode(node.node_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getNodeIcon(node.agent_name)}
                      <div>
                        <div className="font-semibold text-gray-900">
                          {node.agent_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {node.node_id}
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    )}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-300 space-y-4">
                      {/* Agent Prompt */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Agent Task
                        </h4>
                        <p className="text-sm text-gray-700 bg-white bg-opacity-50 p-3 rounded">
                          {node.agent_system_prompt}
                        </p>
                      </div>

                      {/* Inputs */}
                      {Object.keys(node.inputs).length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Inputs
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(node.inputs).map(([key, value]) => (
                              <div
                                key={key}
                                className="text-sm bg-white bg-opacity-50 p-2 rounded"
                              >
                                <span className="font-mono text-blue-700">
                                  {key}:
                                </span>
                                <span className="text-gray-700 ml-2">
                                  {String(value).substring(0, 60)}
                                  {String(value).length > 60 ? "..." : ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Outputs */}
                      {Object.keys(node.outputs).length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Outputs
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(node.outputs).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="text-sm bg-white bg-opacity-50 p-2 rounded"
                                >
                                  <span className="font-mono text-green-700">
                                    {key}:
                                  </span>
                                  <span className="text-gray-700 ml-2">
                                    {String(value).substring(0, 60)}
                                    {String(value).length > 60 ? "..." : ""}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Arrow */}
                {!isLastNode && (
                  <div className="flex justify-center py-2">
                    <div className="w-1 h-8 bg-gradient-to-b from-gray-400 to-gray-300"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Workflow Info */}
        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Workflow Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Entry Point</p>
              <p className="font-mono text-gray-900">
                {workflowData.entry_point}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Exit Point</p>
              <p className="font-mono text-gray-900">
                {workflowData.exit_point}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Nodes</p>
              <p className="font-mono text-gray-900">
                {workflowData.nodes.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Graph Type</p>
              <p className="font-mono text-gray-900">
                {workflowData.graph_type}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
