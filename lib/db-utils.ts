import axios from "axios";
import prismadb from "@/lib/prismadb";
import { Role } from "@prisma/client";

export async function getRoles(): Promise<Role[]> {
    const roles = await fetchRoles();
    return roles;
}

async function fetchRoles() {
    const response = await axios.get("/api/roles");
    return response.data;
}

export async function getBranches(): Promise<Role[]> {
    const branches = await fetchBranches();
    return branches;
}

async function fetchBranches() {
    const response = await axios.get("/api/branches");
    return response.data;
}

export async function getPermissionSets(): Promise<Role[]> {
    const branches = await fetchPermissionSets();
    return branches;
}

async function fetchPermissionSets() {
    const response = await axios.get("/api/permission-sets");
    return response.data;
}
