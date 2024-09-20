const cloudinary = require('cloudinary')
const Img = require('../model/imgModel')
const fs = require('fs')
const JWT = require('jsonwebtoken')

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const removeTemp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err
    })
}

const imgCntrl = {
    addImg: async (req, res) => {
        try {
            const { token } = req.headers;
            const { title } = req.body;
            const { photo } = req.files || req.body;

            if (!token) {
                return res.status(403).send({ message: "Token is required!" });
            }

            const user = await JWT.decode(token);

            const result = await cloudinary.v2.uploader.upload(
                photo.tempFilePath,
                {
                folder: "Albom",
                },
                async (err, result) => {
                if (err) {
                    throw err;
                }

                removeTemp(photo.tempFilePath);

                return result;
                }
            );

            const image = { url: result.secure_url, public_id: result.public_id };

            req.body.author = user._id;

            const author = req.body.author;

            const newPhoto = await Img.create({ author, title, image });

            res.status(201).send({ message: "Succesfully created", newPhoto });
        } catch (error) {
            console.log(error);
            res.status(503).send({message: error.message})            
        }
    },
    getImg: async (req, res) => {
        try {
            const images = await Img.find()

            res.status(200).send({message: 'All Photos', images})
        } catch (error) {
            console.log(error);
            res.status(503).send({message: error.message})
        }
    },
    delImg: async (req, res) => {
        try {
            const { id } = req.params;            

            const image = await Img.findById(id);

            let public_id = image.image.public_id;
            if (image) {
                await cloudinary.v2.uploader.destroy(public_id, async (err) => {
                if (err) {
                    throw err;
                }
                });

                await Img.findByIdAndDelete(id);
                return res.status(200).send({ message: "Deleted!" });
            }
        } catch (error) {
            console.log(error);
            res.status(503).send({message: error.message})
        }
    },
    updateImg: async (req, res) => {
        try {
            const { id } = req.params;
            const { title } = req.body;
            const { image } = req.files;

            const photo = await Img.findById(id);

            if (photo) {
                let public_id = photo.image.public_id;
                await cloudinary.v2.uploader.destroy(public_id, async (err) => {
                if (err) {
                    throw err;
                }
                });

                const result = await cloudinary.v2.uploader.upload(
                image.tempFilePath,
                {
                    folder: "Albom",
                },
                async (err, result) => {
                    if (err) {
                    throw err;
                    }

                    removeTemp(image.tempFilePath);

                    return result;
                }
                );

                const rasm = { url: result.secure_url, public_id: result.public_id };

                const newPhoto = await Img.findByIdAndUpdate(
                id,
                { title, image: rasm },
                {
                    new: true,
                }
                );

                res.status(200).send({ message: "Successfully updated", newPhoto });
            } else {
                res.status(404).send({ message: "Not found" });
            }
        } catch (error) {
            console.log(error);
            res.status(503).send({message: error.message})
        }
    }
}

module.exports = imgCntrl;