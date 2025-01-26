const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Pad with leading zeros if necessary
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

const getVideoMetadata = async (req) => {
  const videoPath = req.file.path;
  const thumbnailPath = `files/${
    req.file.originalname.split(".")[0]
  }-thumbnail.png`;

  // Ensure the thumbnail directory exists
  if (!fs.existsSync("files")) {
    fs.mkdirSync("files");
  }

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on("end", () => {
        console.log("Thumbnail created successfully!");

        // Use ffprobe to get metadata (e.g., duration)
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
          if (err) {
            console.error("Error reading video metadata:", err);
            reject({ error: "Could not process video" });
            return;
          }

          const duration = formatDuration(metadata.format.duration); // Convert duration to MM:SS format

          // Clean up the uploaded file (optional)
          fs.unlink(videoPath, (unlinkErr) => {
            if (unlinkErr)
              console.error("Error deleting uploaded file:", unlinkErr);
          });

          resolve({
            duration,
            thumbnail: `https://api.exactonline.co.tz/${thumbnailPath}`,
          });
        });
      })
      .on("error", (err) => {
        console.error("Error generating thumbnail:", err);
        reject({ error: "Could not generate thumbnail" });
      })
      .screenshots({
        count: 1, // Number of files to generate
        folder: "files", // Directory to save the thumbnail
        filename: `${req.file.originalname.split(".")[0]}-thumbnail.png`, // Thumbnail file name
        size: "320x240", // Thumbnail size (adjust as needed)
      });
  });
};

module.exports = { getVideoMetadata };
