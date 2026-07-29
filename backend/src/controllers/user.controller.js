import {query} from '../config/db.js';
import asyncHandler from '../utils/asynchandler.js';

const seachUsers = asyncHandler(async (req,res) => {
    const q   = (req.query.q || "").trim();
    if(q.length < 2) return res.json({users: []});

    const {rows} = await query(
        `SELECT id, name email, avatar_url
            FROM users
        WHERE name ILIKE $! OR email ILIKE $1
        ORDER BY name ASC 
        LIMIT 10`,
        [`%${q}%`],
    );
    res.json({users: rows});
})

export default seachUsers;