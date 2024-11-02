import axios from 'axios';
import { addFile } from './web3';

const API_KEY = "QN_7277bc6ceed1460e85b6cfa8e1f123a9";
const BASE_URL = "https://api.quicknode.com/ipfs/rest/v1";
const myHeaders = new Headers({
    "x-api-key": API_KEY
});

/**
 * Fetches all files from IPFS with pagination.
 * @param {number} pageNumber - Page number for pagination.
 * @param {number} perPage - Number of results per page.
 * @returns {Promise} - Resolves with the result of the fetch request.
 */
export async function fetchFilesfromIPFS(pageNumber = 1, perPage = 10) {
  const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
  };

  try {
      const response = await fetch(`${BASE_URL}/pinning?pageNumber=${pageNumber}&perPage=${perPage}`, requestOptions);
      return await response.json(); // Directly returning the result
  } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
  }
}

export async function uploadFiletoIPFS(file, milestoneId, account) {
  if (!file) throw new Error("No file provided for upload");

  const formdata = new FormData();
  formdata.append("Body", file, file.name); // Use the selected file
  formdata.append("Key", file.name);        // Use the file name as key
  formdata.append("ContentType", file.type || "text/plain"); // Set content type

  const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
  };

  try {
      const response = await fetch(`${BASE_URL}/s3/put-object`, requestOptions);
      const result = await response.json();

      // Access nested fields inside `pin`
      const { requestid: requestId, pin } = result;
      const cid = pin?.cid;
      const name = pin?.name;

      console.log("Upload Result:", { cid, name, requestId });
      addFile(milestoneId, name, requestId, cid, account)
      // Return only the desired fields
      //return { cid, name, requestId };
  } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
  }
}



/**
 * Downloads a file from IPFS and prompts the user to save it.
 * @param {string} cid - The IPFS content identifier for the file.
 * @param {string} filename - The desired name for the downloaded file.
 */
export async function downloadFileFromIPFS(cid, filename = 'downloadedFile') {
  const url = `https://gateway.pinata.cloud/ipfs/${cid}`;

  try {
    const response = await axios.get(url, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: response.headers['content-type'] });

    // Create a download link and click it to start the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Clean up the link after download
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    console.log(`File downloaded successfully as ${filename}`);
  } catch (error) {
    console.error("Error downloading file:", error.message);
  }
}
