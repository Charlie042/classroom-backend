import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { Router } from "express";
import { departments, subjects } from "../db/schema/app.js";
import { db } from "../db/index.js";
import { count } from "node:console";

const router = Router();

router.get("/", async(req, res) => {
    try {
        const {search, department, page=1, limit=10} = req.query;

        const currentPage = Math.max(1, +page);
        const limitPerPgae = Math.max(1, +limit);

        const offset = (currentPage - 1) * limitPerPgae;

        const filterConditions = [];

        if(search){
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`),
                )
            )
        }

        if(department){
            filterConditions.push(ilike(subjects.departmentId, `%${department}%`))
        }

        const whereclause = filterConditions.length > 0 ? and(...filterConditions) : undefined;
        const countQuery = await db
        .select({count: sql<number>`count(*)`}).from(subjects)
        .leftJoin(departments, eq(subjects.departmentId, departments.id))
        .where(whereclause);

        const totalCount = countQuery[0]?.count ?? 0;

        const subjectList = await db.select({
            ...getTableColumns(subjects),
            department: {...getTableColumns(departments)} 
        }).from(subjects).leftJoin(departments, eq(subjects.departmentId, departments.id))
        .where(whereclause)
        .orderBy(desc(subjects.createdAt))
        .limit(limitPerPgae)
        .offset(offset);


        res.status(200).json({
            data: subjectList,
            pagination: {
                page: currentPage,
                limit: limitPerPgae,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPgae),
            },
        })

    } catch (error) {
        console.error("Get subjects error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;