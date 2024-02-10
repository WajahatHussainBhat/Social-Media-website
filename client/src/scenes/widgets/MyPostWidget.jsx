import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    InputBase,
    useTheme,
    IconButton,
    useMediaQuery,
    Divider,
} from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import AttachFileOutlined from "@mui/icons-material/AttachFileOutlined";
import GifBoxOutlined from "@mui/icons-material/GifBoxOutlined";
import ImageOutlined from "@mui/icons-material/ImageOutlined";
import MicOutlined from "@mui/icons-material/MicOutlined";
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import { useDropzone } from "react-dropzone";

const MyPostWidget = ({ picturePath }) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    const onDrop = (acceptedFiles) => {
        setImage(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: ".jpg,.jpeg,.png",
        multiple: false,
    });

    const handlePost = async() => {
        const formData = new FormData();
        formData.append("userId", _id);
        formData.append("description", post);
        if (image) {
            formData.append("picture", image);
            formData.append("picturePath", image.name);
        }

        const response = await fetch(`http://localhost:3001/posts`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        const posts = await response.json();
        dispatch(setPosts({ posts }));
        setImage(null);
        setPost("");
    };

    return ( <
        WidgetWrapper mt = {!isNonMobileScreens ? "1rem" : undefined } >
        <
        FlexBetween gap = "1.5rem" >
        <
        UserImage image = { picturePath }
        /> <
        InputBase placeholder = "What's on your mind..."
        onChange = {
            (e) => setPost(e.target.value) }
        value = { post }
        sx = {
            {
                width: "100%",
                backgroundColor: palette.neutral.light,
                borderRadius: "2rem",
                padding: "1rem 2rem",
            }
        }
        /> <
        /FlexBetween> {
            isImage && ( <
                Box border = { `1px solid ${medium}` }
                borderRadius = "5px"
                mt = "1rem"
                p = "1rem" >
                <
                div {...getRootProps() }
                style = {
                    { outline: "none" } } >
                <
                input {...getInputProps() }
                /> {
                    !image ? ( <
                        p > Add Image Here < /p>
                    ) : ( <
                        FlexBetween >
                        <
                        Typography > { image.name } < /Typography> <
                        EditOutlined / >
                        <
                        /FlexBetween>
                    )
                } <
                /div> {
                    image && ( <
                        IconButton onClick = {
                            () => setImage(null) }
                        sx = {
                            { width: "15%" } } >
                        <
                        DeleteOutlined / >
                        <
                        /IconButton>
                    )
                } <
                /Box>
            )
        }

        <
        Divider sx = {
            { margin: "1.25rem 0" } }
        />

        <
        FlexBetween >
        <
        FlexBetween gap = "0.25rem"
        onClick = {
            () => setIsImage(!isImage) } >
        <
        ImageOutlined sx = {
            { color: mediumMain } }
        /> <
        Typography color = { mediumMain }
        sx = {
            { "&:hover": { cursor: "pointer", color: medium } } } >
        Image <
        /Typography> <
        /FlexBetween>

        {
            isNonMobileScreens ? ( <
                >
                <
                FlexBetween gap = "0.25rem" >
                <
                GifBoxOutlined sx = {
                    { color: mediumMain } }
                /> <
                Typography color = { mediumMain } > Clip < /Typography> <
                /FlexBetween>

                <
                FlexBetween gap = "0.25rem" >
                <
                AttachFileOutlined sx = {
                    { color: mediumMain } }
                /> <
                Typography color = { mediumMain } > Attachment < /Typography> <
                /FlexBetween>

                <
                FlexBetween gap = "0.25rem" >
                <
                MicOutlined sx = {
                    { color: mediumMain } }
                /> <
                Typography color = { mediumMain } > Audio < /Typography> <
                /FlexBetween> <
                />
            ) : ( <
                FlexBetween gap = "0.25rem" >
                <
                MoreHorizOutlined sx = {
                    { color: mediumMain } }
                /> <
                /FlexBetween>
            )
        }

        <
        Button disabled = {!post }
        onClick = { handlePost }
        sx = {
            {
                color: palette.background.alt,
                backgroundColor: palette.primary.main,
                borderRadius: "3rem",
            }
        } >
        POST <
        /Button> <
        /FlexBetween> <
        /WidgetWrapper>
    );
};

export default MyPostWidget;