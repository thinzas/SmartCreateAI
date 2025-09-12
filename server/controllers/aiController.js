import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
// import Replicate from "replicate";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'
import axios from 'axios';
import { InferenceClient } from "@huggingface/inference";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// const replicate = new Replicate({
//     auth: process.env.REPLICATE_API_TOKEN,
// });

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { prompt, length } = req.body
        const plan = req.plan
        const free_usage = req.free_usage

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue." })
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: length
        });

        const content = response.choices[0].message.content

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }

        res.json({ success: true, content })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { prompt } = req.body
        const plan = req.plan
        const free_usage = req.free_usage

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue." })
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 100
        });

        const content = response.choices[0].message.content

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }

        res.json({ success: true, content })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// export const generateImage = async (req, res) => {
//     try {
//         const { userId } = req.auth()
//         const { prompt, publish } = req.body
//         const plan = req.plan

//         if (plan !== 'premium') {
//             return res.json({ success: false, message: "This feature is only available for premium subscriptions." })
//         }

//         const output = await replicate.run(
//             "ideogram-ai/ideogram-v3-turbo",
//             {
//                 input: {
//                     prompt: prompt
//                 }
//             }
//         );

//         console.log("Replicate response:", output);

//         // Handle FileOutput object - convert to URL string
//         let imageUrl;
//         if (Array.isArray(output)) {
//             // If it's an array, get the first item
//             const firstOutput = output[0];
//             imageUrl = typeof firstOutput === 'string' ? firstOutput : firstOutput.toString();
//         } else {
//             // If it's a single FileOutput object
//             imageUrl = typeof output === 'string' ? output : output.toString();
//         }

//         console.log("Extracted image URL:", imageUrl);

//         if (!imageUrl) {
//             throw new Error("No image URL received from Replicate");
//         }

//         console.log("Uploading to Cloudinary...");

//         // Upload the URL string to Cloudinary
//         const cloudinaryResponse = await cloudinary.uploader.upload(imageUrl, {
//             folder: "SmartCreateAI/generated-images",
//             resource_type: "image"
//         });

//         const secure_url = cloudinaryResponse.secure_url;
//         console.log("Image uploaded successfully:", secure_url);

//         await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`


//         res.json({ success: true, content: secure_url })

//     } catch (error) {

//         console.log(error.message)
//         res.json({ success: false, message: error.message })
//     }
// }

export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: "Image generation is only available for premium subscriptions."
            });
        }

        console.log("Generating image with Hugging Face for user:", userId);

        // Correct Hugging Face API call
        const imageBlob = await client.textToImage({
            model: "black-forest-labs/FLUX.1-schnell", // Use schnell for faster generation
            inputs: prompt,
        });

        console.log("Image generated successfully");

        // Convert blob to buffer
        const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());

        // Upload buffer to Cloudinary
        const cloudinaryResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "SmartCreateAI/generated-images",
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(imageBuffer);
        });

        const secure_url = cloudinaryResponse.secure_url;
        console.log("Image uploaded successfully:", secure_url);

        await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`

        res.json({ success: true, content: secure_url })

    } catch (error) {
        console.error("Image generation error:", error);

        // More specific error handling
        if (error.status === 503 || error.response?.status === 503) {
            res.json({
                success: false,
                message: "Model is loading. Please wait 2-3 minutes and try again."
            });
        } else if (error.status === 429 || error.response?.status === 429) {
            res.json({
                success: false,
                message: "Rate limit exceeded. Please try again in a few minutes."
            });
        } else if (error.status === 401 || error.response?.status === 401) {
            res.json({
                success: false,
                message: "Invalid API key. Please check your Hugging Face configuration."
            });
        } else {
            res.json({
                success: false,
                message: "Failed to generate image. Please try again."
            });
        }
    }
};

export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth()
        const image = req.file
        const plan = req.plan

        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions." })
        }


        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal: 'remove_the_background'

                }
            ]
        })

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`


        res.json({ success: true, content: secure_url })

    } catch (error) {

        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const removeImageObject = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { object } = req.body
        const image = req.file
        const plan = req.plan


        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions." })
        }


        const { public_id } = await cloudinary.uploader.upload(image.path)

        const imageUrl = cloudinary.url(public_id, {
            transformation: [{ effect: `gen_remove:${object}` }],
            resource_type: 'image'
        })

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`


        res.json({ success: true, content: imageUrl })

    } catch (error) {

        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const resumeReview = async (req, res) => {
    try {
        const { userId } = req.auth()
        const resume = req.file
        const plan = req.plan


        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions." })
        }


        if (resume.size > 5 * 1024 * 1024) {
            return res.json({
                success: false, message: 'Resume file size exceeds allowed file size (5MB).'

            })
        }

        const dataBuffer = fs.readFileSync(resume.path)
        const pdfData = await pdf(dataBuffer)

        const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume content: \n\n${pdfData.text}`


        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        const content = response.choices[0].message.content


        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`


        res.json({ success: true, content })

    } catch (error) {

        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Add this test function to your controller temporarily
export const testHuggingFace = async (req, res) => {
    try {
        const response = await client.textToImage({
            provider: "together",
            model: "black-forest-labs/FLUX.1-dev",
            inputs: prompt,
            parameters: { num_inference_steps: 5 },
        });

        res.json({ success: true, message: "Token works!", data: response.status });
    } catch (error) {
        res.json({ success: false, message: "Token test failed", error: error.response?.status });
    }
};