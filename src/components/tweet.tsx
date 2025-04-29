import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth } from "../routes/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../routes/firebase";
import { useState, useRef } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  object-fit: cover;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
  white-space: pre-line;
`;

const EditablePayload = styled.textarea`
  margin: 10px 0px;
  font-size: 18px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  padding: 8px;
  font-family: inherit;
  resize: vertical;
  min-height: 60px;
`;

const ButtonGroup = styled.div`
  display: flex;
  margin-top: 30px;
  gap: 10px;
`;

const Button = styled.button`
  background-color: transparent;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    fill: white;
    &:hover {
      fill: tomato;
    }
  }
`;

const SaveButton = styled(Button)`
  color: #4caf50;
  &:hover {
    background-color: rgba(76, 175, 80, 0.1);
  }
`;

const CancelButton = styled(Button)`
  color: #f44336;
  &:hover {
    background-color: rgba(244, 67, 54, 0.1);
  }
`;

const EditButton = styled(Button)`
  &:hover svg {
    fill: #2196f3;
  }
`;

const DeleteButton = styled(Button)`
  &:hover svg {
    fill: #f44336;
  }
`;

export default function Tweet({
  username,
  fileData,
  tweet,
  userId,
  id,
}: ITweet) {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTweet, setEditedTweet] = useState(tweet);
  const [imagePreview, setImagePreview] = useState<string | null>(
    fileData ?? null
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");

    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
    } catch (e) {
      console.log(e);
    }
  };

  const startEditing = () => {
    if (user?.uid !== userId) return;
    setEditedTweet(tweet);
    setImagePreview(fileData ?? null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedTweet(tweet);
    setImagePreview(fileData ?? null);
    // Removed undefined function call
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 크기 확인 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert("이미지 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 이미지를 base64로 변환
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const openFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const saveEdit = async () => {
    if (!editedTweet.trim() || user?.uid !== userId) return;

    try {
      setIsUploading(true);
      const updatedData: { tweet: string; fileData?: string | null } = {
        tweet: editedTweet,
      };
      if (imagePreview !== fileData) {
        updatedData.fileData = imagePreview;
      }

      await updateDoc(doc(db, "tweets", id), updatedData);
      setIsEditing(false);
      setIsUploading(false);
    } catch (e) {
      console.log(e);
      setIsUploading(false);
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>

        {isEditing ? (
          <>
            <EditablePayload
              value={editedTweet}
              onChange={(e) => setEditedTweet(e.target.value)}
              autoFocus
            />
            <ButtonGroup>
              <SaveButton onClick={saveEdit} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="animate-spin size-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Save
                  </>
                )}
              </SaveButton>
              <CancelButton onClick={cancelEditing}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
                Cancel
              </CancelButton>
            </ButtonGroup>
          </>
        ) : (
          <>
            <Payload>{tweet}</Payload>

            {user?.uid === userId && (
              <ButtonGroup>
                <EditButton onClick={startEditing}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
                  </svg>
                  Edit
                </EditButton>
                <DeleteButton onClick={onDelete}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                  Delete
                </DeleteButton>
              </ButtonGroup>
            )}
          </>
        )}
      </Column>
      <Column>
        {isEditing ? (
          <>
            <ImageContainer>
              {imagePreview ? (
                <>
                  <Photo src={imagePreview} alt="Tweet image preview" />
                  <ImageOverlay onClick={openFileInput}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="white"
                      className="size-5"
                    >
                      <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
                    </svg>
                  </ImageOverlay>
                </>
              ) : (
                <ButtonGroup>
                  <Button onClick={openFileInput}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" />
                      <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                    </svg>
                    Add Image
                  </Button>
                </ButtonGroup>
              )}
              <FileInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
            </ImageContainer>
            {imagePreview && (
              <Button onClick={removeImage} style={{ marginTop: "10px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="#f44336"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                Remove Image
              </Button>
            )}
          </>
        ) : fileData ? (
          <Photo src={fileData} alt="User's photo" />
        ) : null}
      </Column>
    </Wrapper>
  );
}
