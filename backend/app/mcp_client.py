# app/core/mcp_client.py
import os

import requests
from dotenv import load_dotenv
from mcp.client.streamable_http import streamablehttp_client
from strands.tools.mcp.mcp_client import MCPClient

# from functools import lru_cache

load_dotenv()

token_url = os.getenv("TOKEN_URL")
client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")
gateway_url = os.getenv("GATEWAY_URL")


def fetch_access_token():
    response = requests.post(
        token_url,
        data=f"grant_type=client_credentials&client_id={client_id}&client_secret={client_secret}",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    response.raise_for_status()
    return response.json()["access_token"]


def _create_streamable_http_transport(headers=None):
    url = gateway_url  # ✅ must be a string
    access_token = fetch_access_token()
    headers = headers or {}
    headers["Authorization"] = f"Bearer {access_token}"
    return streamablehttp_client(url, headers=headers)


# ✅ Create reusable MCP client instance
mcp_client = MCPClient(_create_streamable_http_transport)
