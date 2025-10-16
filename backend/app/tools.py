import datetime
import random

from strands import tool


def random_date(days=30):
    return (
        datetime.datetime.now() - datetime.timedelta(days=random.randint(0, days))
    ).strftime("%Y-%m-%d")


# ===========================
# 🧩 SQL TOOLS
# ===========================


@tool(
    name="custom_query",
    description="Takes any natural language query as input and provides the desired data as output",
)
def custom_query(connection_id: str, user_query: str):
    print(
        f"🧩 Invoked custom_query with connection_id={connection_id}, user_query={user_query}"
    )
    return {
        "query": user_query,
        "connection_id": connection_id,
        "rows": [
            {"patient_id": "P1001", "name": "Arjun Patel", "age": 45, "gender": "Male"},
            {
                "patient_id": "P1002",
                "name": "Meera Sharma",
                "age": 52,
                "gender": "Female",
            },
        ],
        "status": "success",
    }


@tool(
    name="patient_service",
    description="Patient data management service for retrieving and processing patient information",
)
def patient_service(patient_id: str, connection_id: str):
    print(
        f"🧩 Invoked patient_service with patient_id={patient_id}, connection_id={connection_id}"
    )
    return {
        "patient_id": patient_id,
        "name": "Amit Verma",
        "dob": "1979-08-15",
        "gender": "Male",
        "blood_group": "O+",
        "contact": {"phone": "+91-9876543210", "email": "amit.verma@example.com"},
        "status": "active",
    }


@tool(
    name="medication_service",
    description="Medication data management service for handling patient medication records",
)
def medication_service(patient_id: str, connection_id: str):
    print(
        f"🧩 Invoked medication_service with patient_id={patient_id}, connection_id={connection_id}"
    )
    return {
        "patient_id": patient_id,
        "active_medications": [
            {"drug": "Metformin", "dosage": "500mg", "frequency": "Twice daily"},
            {"drug": "Amlodipine", "dosage": "5mg", "frequency": "Once daily"},
        ],
        "last_updated": random_date(10),
    }


@tool(
    name="followup_service",
    description="Follow-up appointment management service for scheduling and tracking patient follow-ups",
)
def followup_service(patient_id: str, connection_id: str):
    return {
        "patient_id": patient_id,
        "next_followup": (
            datetime.datetime.now() + datetime.timedelta(days=14)
        ).strftime("%Y-%m-%d"),
        "department": "Cardiology",
        "doctor": "Dr. Neha Singh",
        "remarks": "Monitor blood pressure daily and report any dizziness",
    }


@tool(
    name="condition_service",
    description="Medical condition management service for handling patient medical conditions and diagnoses",
)
def condition_service(patient_id: str, connection_id: str):
    return {
        "patient_id": patient_id,
        "diagnoses": [
            {
                "condition": "Type 2 Diabetes Mellitus",
                "diagnosed_on": "2016-05-10",
                "status": "chronic",
            },
            {
                "condition": "Hypertension",
                "diagnosed_on": "2018-03-21",
                "status": "controlled",
            },
        ],
    }


@tool(
    name="lab_service",
    description="Lab results management service for processing and retrieving laboratory test results",
)
def lab_service(patient_id: str, connection_id: str):
    return {
        "patient_id": patient_id,
        "lab_results": [
            {
                "test": "HbA1c",
                "result": "6.8%",
                "reference_range": "< 7%",
                "date": random_date(15),
            },
            {
                "test": "Cholesterol",
                "result": "190 mg/dL",
                "reference_range": "< 200 mg/dL",
                "date": random_date(10),
            },
        ],
    }


@tool(
    name="procedure_service",
    description="Medical procedure management service for handling patient medical procedures",
)
def procedure_service(patient_id: str, connection_id: str):
    return {
        "patient_id": patient_id,
        "procedures": [
            {
                "name": "Angioplasty",
                "date": "2021-09-10",
                "performed_by": "Dr. Rajesh Mehta",
            },
            {"name": "ECG", "date": random_date(3), "performed_by": "Technician Ankit"},
        ],
    }


@tool(
    name="allergy_service",
    description="Allergy information management service for tracking patient allergies and reactions",
)
def allergy_service(patient_id: str, connection_id: str):
    return {
        "patient_id": patient_id,
        "allergies": [
            {"substance": "Penicillin", "reaction": "Rash", "severity": "Mild"},
            {"substance": "Peanuts", "reaction": "Anaphylaxis", "severity": "Severe"},
        ],
    }


@tool(
    name="appointment_service",
    description="Appointment scheduling service for managing patient appointments",
)
def appointment_service(patient_id: str, connection_id: str):
    return {
        "patient_id": patient_id,
        "appointments": [
            {
                "date": random_date(-5),
                "doctor": "Dr. Alok Bansal",
                "department": "Endocrinology",
            },
            {
                "date": random_date(15),
                "doctor": "Dr. Neha Singh",
                "department": "Cardiology",
            },
        ],
    }


@tool(
    name="diet_service",
    description="Diet and nutrition management service for handling patient dietary information",
)
def diet_service(patient_id: str, connection_id: str):
    return {
        "patient_id": patient_id,
        "diet_plan": {
            "breakfast": "Oats with skimmed milk and almonds",
            "lunch": "Brown rice, dal, and mixed salad",
            "dinner": "Vegetable soup and multigrain roti",
        },
        "calories_per_day": 1800,
    }


@tool(
    name="patient_dashboard_service",
    description="Patient dashboard data service for comprehensive patient overview",
)
def patient_dashboard_service(patient_id: str, connection_id: str):
    return {
        "patient_id": patient_id,
        "vitals": {"bp": "120/80", "pulse": 78, "bmi": 24.5},
        "active_conditions": ["Diabetes", "Hypertension"],
        "last_lab_result_date": random_date(7),
    }


# ===========================
# 🧩 EPIC TOOLS
# ===========================


@tool(
    name="generate_patient_observ",
    description="Generate Epic patient observation summary with detailed patient information",
)
def generate_patient_observ(patient_id: str, organization: str):
    return {
        "organization": organization,
        "patient_id": patient_id,
        "observations": {
            "weight": "72 kg",
            "height": "175 cm",
            "blood_pressure": "122/78 mmHg",
            "temperature": "98.4°F",
        },
        "observation_date": random_date(5),
    }


@tool(
    name="generate_medication",
    description="Generate Epic medication summary for patient's current and past medications",
)
def generate_medication(patient_id: str, organization: str):
    return {
        "organization": organization,
        "patient_id": patient_id,
        "current": ["Metformin 500mg", "Amlodipine 5mg"],
        "past": ["Atorvastatin 10mg"],
        "last_reviewed": random_date(14),
    }


@tool(
    name="generate_agent_Response_followup",
    description="Generate Epic follow-up appointment summary and recommendations",
)
def generate_agent_Response_followup(patient_id: str, organization: str):
    return {
        "organization": organization,
        "patient_id": patient_id,
        "next_followup": random_date(-10),
        "advice": "Continue medication as prescribed, monitor sugar levels, and maintain diet.",
    }


@tool(
    name="generate_condition",
    description="Generate Epic medical condition summary for patient's diagnoses",
)
def generate_condition(patient_id: str, organization: str):
    return {
        "organization": organization,
        "patient_id": patient_id,
        "conditions": ["Type 2 Diabetes", "Mild Hypertension"],
        "status": "stable",
    }


@tool(
    name="generate_lab",
    description="Generate Epic lab results summary with test results and interpretations",
)
def generate_lab(patient_id: str, organization: str):
    return {
        "organization": organization,
        "patient_id": patient_id,
        "latest_results": {
            "HbA1c": "6.5%",
            "Cholesterol": "180 mg/dL",
            "Vitamin D": "28 ng/mL",
        },
        "date": random_date(5),
    }


@tool(
    name="generate_procedure",
    description="Generate Epic medical procedure summary for patient's procedures",
)
def generate_procedure(patient_id: str, organization: str):
    return {
        "organization": organization,
        "patient_id": patient_id,
        "procedures": [
            {"name": "Echocardiogram", "date": "2023-12-01"},
            {"name": "ECG", "date": random_date(3)},
        ],
    }


@tool(
    name="generate_allergy",
    description="Generate Epic allergy summary for patient's known allergies",
)
def generate_allergy(patient_id: str, organization: str):
    return {
        "organization": organization,
        "patient_id": patient_id,
        "allergies": [
            {"allergen": "Dust", "reaction": "Cough"},
            {"allergen": "Pollen", "reaction": "Sneezing"},
        ],
    }


@tool(
    name="generate_agent_Response_upcoming",
    description="Generate Epic upcoming appointment summary and preparation details",
)
def generate_agent_Response_upcoming(patient_id: str, organization: str):
    return {
        "organization": organization,
        "patient_id": patient_id,
        "appointments": [
            {
                "date": random_date(-2),
                "department": "Cardiology",
                "doctor": "Dr. Alok Bansal",
            },
        ],
        "preparation": "Avoid heavy meals before tests.",
    }


@tool(
    name="generate_agent_Response_nutrition",
    description="Generate Epic nutrition summary with dietary recommendations",
)
def generate_agent_Response_nutrition(patient_id: str, organization: str):
    return {
        "organization": organization,
        "patient_id": patient_id,
        "nutrition_summary": "Balanced diet with reduced sodium and increased fiber.",
        "recommended_foods": ["Oats", "Broccoli", "Apple"],
    }


@tool(
    name="get_diet_data",
    description="Get Epic diet data including nutritional information and dietary restrictions",
)
def get_diet_data(patient_id: str, organization: str):
    return {
        "organization": organization,
        "patient_id": patient_id,
        "diet": {
            "carbs": "50%",
            "proteins": "25%",
            "fats": "25%",
            "restrictions": ["No sugar", "Low salt"],
        },
    }


@tool(
    name="riskpanel",
    description="Generate Epic risk assessment panel with health risk analysis",
)
def riskpanel(patient_id: str, organization: str):
    return {
        "organization": organization,
        "patient_id": patient_id,
        "risk_scores": {"cardiac": 0.35, "diabetes": 0.7, "stroke": 0.2},
        "overall_risk": "moderate",
    }


@tool(
    name="aftercare",
    description="Generate Epic aftercare summary with post-treatment care instructions",
)
def aftercare(patient_id: str, organization: str):
    return {
        "organization": organization,
        "patient_id": patient_id,
        "instructions": [
            "Take medications on time.",
            "Avoid strenuous activity for 7 days.",
            "Report any chest discomfort immediately.",
        ],
    }


@tool(
    name="get_patient_vitals",
    description="Get Epic patient vital signs including heart rate, blood pressure, temperature",
)
def get_patient_vitals(patient_id: str, organization: str):
    return {
        "organization": organization,
        "patient_id": patient_id,
        "vitals": {"bp": "118/78 mmHg", "pulse": 76, "temp": "98.6°F", "spo2": "98%"},
        "recorded_at": random_date(1),
    }


from strands import tool


@tool(
    name="bed_turnaround_service",
    description="Service for retrieving bed turnaround time data by disease category or specific disease",
)
def bed_turnaround_service():
    """
    Returns static bed turnaround time statistics for diseases.
    """
    print("🧩 Invoked bed_turnaround_service with static data")

    disease_data = [
        {
            "disease": "Pneumonia",
            "category": "Respiratory",
            "avg_turnaround_hours": 4.5,
            "min_turnaround_hours": 2.0,
            "max_turnaround_hours": 8.0,
            "cleaning_time_hours": 1.5,
            "prep_time_hours": 1.0,
            "inspection_time_hours": 0.5,
            "total_beds": 45,
            "last_30_days_discharges": 120,
        },
        {
            "disease": "Cardiac Arrest",
            "category": "Cardiac",
            "avg_turnaround_hours": 6.2,
            "min_turnaround_hours": 3.5,
            "max_turnaround_hours": 12.0,
            "cleaning_time_hours": 2.0,
            "prep_time_hours": 1.5,
            "inspection_time_hours": 1.0,
            "total_beds": 30,
            "last_30_days_discharges": 85,
        },
        {
            "disease": "Diabetes",
            "category": "Endocrine",
            "avg_turnaround_hours": 3.8,
            "min_turnaround_hours": 2.5,
            "max_turnaround_hours": 6.0,
            "cleaning_time_hours": 1.0,
            "prep_time_hours": 0.8,
            "inspection_time_hours": 0.3,
            "total_beds": 60,
            "last_30_days_discharges": 200,
        },
    ]

    return disease_data


@tool(
    name="bed_availability_service",
    description="Service for checking current bed availability and status by department or disease type",
)
def bed_availability_service():
    """
    Returns static current bed availability and occupancy data.
    """
    print("🧩 Invoked bed_availability_service with static data")

    availability_data = [
        {
            "department": "ICU",
            "total_beds": 50,
            "occupied_beds": 42,
            "available_beds": 8,
            "beds_in_turnaround": 3,
            "avg_wait_time_hours": 2.5,
            "occupancy_rate": 84.0,
        },
        {
            "department": "General Ward",
            "total_beds": 200,
            "occupied_beds": 165,
            "available_beds": 35,
            "beds_in_turnaround": 12,
            "avg_wait_time_hours": 1.2,
            "occupancy_rate": 82.5,
        },
    ]

    return availability_data


@tool(
    name="discharge_workflow_service",
    description="Service for retrieving discharge and bed preparation workflow steps and timings",
)
def discharge_workflow_service():
    """
    Returns static workflow steps for bed turnaround process.
    """
    print("🧩 Invoked discharge_workflow_service with static data")

    workflow = {
        "workflow_type": "standard",
        "total_estimated_time_hours": 4.0,
        "steps": [
            {
                "step_number": 1,
                "step_name": "Patient Discharge",
                "duration_minutes": 30,
                "responsible_team": "Nursing",
            },
            {
                "step_number": 2,
                "step_name": "Initial Cleaning",
                "duration_minutes": 60,
                "responsible_team": "Housekeeping",
            },
            {
                "step_number": 3,
                "step_name": "Deep Sanitization",
                "duration_minutes": 45,
                "responsible_team": "Housekeeping",
            },
            {
                "step_number": 4,
                "step_name": "Bed Preparation",
                "duration_minutes": 30,
                "responsible_team": "Nursing",
            },
            {
                "step_number": 5,
                "step_name": "Equipment Check",
                "duration_minutes": 20,
                "responsible_team": "Biomedical",
            },
            {
                "step_number": 6,
                "step_name": "Final Inspection",
                "duration_minutes": 15,
                "responsible_team": "Quality Control",
            },
        ],
    }

    return workflow


@tool(
    name="turnaround_analytics_service",
    description="Service for analyzing bed turnaround performance metrics and trends over time",
)
def turnaround_analytics_service():
    """
    Returns static analytics and trends for bed turnaround times.
    """
    print("🧩 Invoked turnaround_analytics_service with static data")

    analytics = {
        "time_period": "last_30_days",
        "metric_type": "average",
        "overall_avg_turnaround_hours": 4.8,
        "best_performing_disease": "Diabetes",
        "worst_performing_disease": "Cardiac Arrest",
        "improvement_percentage": 12.5,
        "bottleneck_step": "Deep Sanitization",
        "bottleneck_avg_delay_minutes": 25,
        "disease_performance": [
            {
                "disease": "Pneumonia",
                "avg_hours": 4.5,
                "trend": "improving",
                "efficiency_score": 85,
            },
            {
                "disease": "Cardiac Arrest",
                "avg_hours": 6.2,
                "trend": "stable",
                "efficiency_score": 72,
            },
            {
                "disease": "Diabetes",
                "avg_hours": 3.8,
                "trend": "improving",
                "efficiency_score": 92,
            },
        ],
        "recommendations": [
            "Increase housekeeping staff during peak hours",
            "Implement parallel processing for equipment checks",
            "Automate bed status notifications",
        ],
    }

    return analytics


available_tools = [
    custom_query,
    patient_service,
    medication_service,
    followup_service,
    condition_service,
    lab_service,
    procedure_service,
    allergy_service,
    appointment_service,
    diet_service,
    patient_dashboard_service,
    generate_patient_observ,
    generate_medication,
    generate_agent_Response_followup,
    generate_condition,
    generate_lab,
    generate_procedure,
    generate_allergy,
    generate_agent_Response_upcoming,
    generate_agent_Response_nutrition,
    get_diet_data,
    riskpanel,
    aftercare,
    get_patient_vitals,
    # Bed Turnaround Tools
    bed_turnaround_service,
    bed_availability_service,
    discharge_workflow_service,
    turnaround_analytics_service,
]
