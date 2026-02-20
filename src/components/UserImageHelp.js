import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
const config = require('../ApiConfig');

function UserImage({ open, handleClose, userCode, userImage }) {
    const [user_images, setuser_images] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const maxSize = 1 * 1024 * 1024;
            if (file.size > maxSize) {
                Swal.fire({
                    icon: 'error',
                    title: 'File Too Large',
                    text: 'File size exceeds 1MB. Please upload a smaller file.',
                    confirmButtonText: 'OK'
                });
                event.target.value = null;
                return;
            }
            setSelectedImage(URL.createObjectURL(file));
            setuser_images(file);
        }
    };

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const logoSrc = selectedImage
        ? selectedImage
        : userImage
            ? `data:image/jpeg;base64,${typeof userImage === 'object' ? arrayBufferToBase64(userImage.data) : userImage}`
            : null;

    const handleInsert = async () => {
        if (!userCode) {
            return;
        }
        try {
            const formData = new FormData();
            formData.append("user_code", userCode);

            if (user_images) {
                formData.append("user_img", user_images);
                formData.append("user", sessionStorage.getItem("selectedUserCode"));
            }

            const response = await fetch(`${config.apiBaseUrl}/UpdateUserImage`, {
                method: "POST",
                body: formData,
            });

            if (response.status === 200) {
                console.log("Data inserted successfully");
                setTimeout(() => {
                    toast.success("Data updated successfully!", {
                        onClose: () => window.location.reload(),
                    });
                }, 1000);
            } else if (response.status === 400) {
                const errorResponse = await response.json();
                console.error(errorResponse.message);
                toast.warning(errorResponse.message, {

                });
            } else {
                console.error("Failed to insert data");
                toast.error('Failed to insert data', {

                });
            }
        } catch (error) {
            console.error("Error inserting data:", error);
            console.error("Error inserting data:", error);
            toast.error('Error inserting data: ' + error.message, {

            });
        }
    };

    return (
        <div>
            {open && (
                <fieldset>
                    <div className="modal container-fluid" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} >
                        <ToastContainer position="top-right" className="toast-design" theme="colored" />
                        <div className="modal-dialog modal-xl ps-5 p-1 pe-5" role="document">
                            <div className="modal-content">
                                <div class="row justify-content-center">
                                    <div class="col-md-12 text-center">
                                        <div className="bg-body-tertiary">
                                            <div className="mb-0 d-flex justify-content-between" >
                                                <h1 class="me-5 ms-4 fs-2 mt-1">Update Image</h1>
                                                <button onClick={handleClose} className="btn btn-danger shadow-none mt-0 rounded-0 h-70 fs-5" required title="Close">
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="pt-2 mb-4">
                                        <div className="modal-body">
                                            <div class="row ms-3 me-3">
                                                <div className="col-md-3 form-group mb-2">
                                                    <div class="exp-form-floating">
                                                        <div class="d-flex justify-content-start">
                                                            <div>
                                                                <label for="state" class="exp-form-labels">
                                                                    Code
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <span className="text-danger">*</span>
                                                            </div>
                                                        </div><input
                                                            id="Icode"
                                                            class="exp-input-field form-control"
                                                            type="text"
                                                            placeholder=""
                                                            required title="Please enter the code"
                                                            maxLength={18}
                                                            value={userCode}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 form-group mb-2 ">
                                                    <div class="exp-form-floating">
                                                        <label for="locno" class="exp-form-labels">
                                                            Image
                                                        </label>
                                                        <input type="file"
                                                            class="exp-input-field form-control"
                                                            accept="image/*"
                                                            onChange={handleFileSelect}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 form-group mb-2">
                                                    <div className="exp-form-floating">
                                                        <div className="image-frame" style={{
                                                            width: "200px",
                                                            height: "200px",
                                                            border: "2px solid #ccc",
                                                            padding: "10px",
                                                            textAlign: "center",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}>
                                                            <img
                                                                src={logoSrc || 'default-placeholder.png'}
                                                                alt="Preview"
                                                                style={{
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-4 form-group  ">
                                                    <button onClick={handleInsert} className="btn btn-primary rounded-3" required title="update"> Update</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            )}
        </div>


    );
}
export default UserImage;
