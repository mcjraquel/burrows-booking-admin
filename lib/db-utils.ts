import axios from "axios";
import prismadb from "@/lib/prismadb";
import { Branch, PermissionSet, Role, Service } from "@prisma/client";

export async function getRoles(): Promise<Role[]> {
    const roles = await fetchRoles();
    return roles;
}

async function fetchRoles() {
    const response = await axios.get("/api/roles");
    return response.data;
}

export async function getBranches(): Promise<Branch[]> {
    const branches = await fetchBranches();
    return branches;
}

async function fetchBranches() {
    const response = await axios.get("/api/branches");
    return response.data;
}

export async function getPermissionSets(): Promise<PermissionSet[]> {
    const branches = await fetchPermissionSets();
    return branches;
}

async function fetchPermissionSets() {
    const response = await axios.get("/api/permission-sets");
    return response.data;
}

export async function getServices(): Promise<Service[]> {
    const services = await fetchServices();
    return services;
}

async function fetchServices() {
    const response = await axios.get("/api/services");
    return response.data;
}
