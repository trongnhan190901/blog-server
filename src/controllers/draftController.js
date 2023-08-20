const Draft = require('../models/Draft');

exports.getDraftById = async (req, res) => {
    try {
        const draftId = req.params.id;

        const draft = await Draft.findById(draftId).populate(
            'author',
            'name avatar',
        );

        if (!draft) {
            return res.status(404).json({ message: 'Draft post not found' });
        }

        res.json(draft);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching draft post' });
    }
};

exports.saveDraft = async (req, res) => {
    try {
        const { title, desc, content, author } = req.body;
        const slug = await createUniqueSlug(title);

        const newDraftBlog = new Draft({
            title,
            desc,
            content,
            author,
            slug,
        });

        await newDraftBlog.save();
        res.status(201).json(newDraftBlog);
    } catch (error) {
        res.status(500).json({ message: 'Error drafting blog post' });
    }
};

exports.updateDraft = async (req, res) => {
    try {
        const draftId = req.params.id;

        const draft = await Draft.findOneAndUpdate(
            { _id: draftId },
            {
                $set: {
                    title: req.body.title,
                    desc: req.body.desc,
                    content: req.body.content,
                    updatedAt: new Date(),
                },
            },
            { new: true },
        );

        if (!draft) {
            return res.status(404).json({ message: 'Draft not found' });
        }

        res.json(draft);
    } catch (error) {
        res.status(500).json({ message: 'Error updating draft' });
    }
};

exports.deleteDraft = async (req, res) => {
    try {
        const draftId = req.params.id;

        const draft = await Draft.findOneAndDelete({
            _id: draftId,
        });

        if (!draft) {
            return res.status(404).json({ message: 'Draft not found' });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting draft' });
    }
};
