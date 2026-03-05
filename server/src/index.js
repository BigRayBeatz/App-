app.put('/api/user/profile', async (req, res) => {
    const { full_name, bio, is_public } = req.body;
    try {
        await pool.query(
            'UPDATE users SET full_name = $1, bio = $2, is_public = $3 WHERE id = $4',
            [full_name, bio, is_public, req.user.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Profile Node Update Failed" });
    }
});
