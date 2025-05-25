export const uploadImage = async (image: any) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "mymymy");
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME??"");
    data.append("folder", "Cloudinary-React");
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload/`,
        {
          method: "POST",
          body: data,
        },
      );
      const res = await response.json();
      if(response.ok){
        return {error : null, url : res.url}
      }
      return {error : res.error.message, url : null};
    } catch (e : any) {
      return {error : e.toString(), url : null};
    }
};
