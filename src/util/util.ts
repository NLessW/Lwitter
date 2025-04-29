export const handleFileChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  onFileLoad: (fileData: string) => void
) => {
  const { files } = event.target;
  if (files && files.length === 1) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      console.log("File data encoded:", result); // 확인 로그 추가
      onFileLoad(result); // 파일 데이터를 콜백으로 전달
    };
    reader.readAsDataURL(files[0]);
  }
};
