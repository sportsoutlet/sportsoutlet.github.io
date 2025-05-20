import { useState } from 'react';
import { UserCog, X } from 'lucide-react';
import RegisterForm from './RegisterForm';

export default function EditProfile({ userInfo, setUserInfo }) {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(userInfo);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setUserInfo(form);
        localStorage.setItem('userInfo', JSON.stringify(form));
        setShowModal(false);
    };

    return (
        <div>
            {/* Edit Button */}
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 text-white/70 hover:text-white transition px-2 py-1 rounded absolute top-1 right-1 max-w-fit"
                title="Edit Profile"
            >
                <UserCog size={18} />
                <span className="text-sm font-medium">Edit Profile</span>
            </button>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
                    onClick={() => setShowModal(false)} // ✅ clicking background closes modal
                >
                    <div
                        className="bg-neutral-900 rounded-xl p-6 w-[90%] max-w-md text-white relative animate-fade-in shadow-lg"
                        onClick={(e) => e.stopPropagation()} // 🛑 prevent click inside modal from closing it
                    >
                        <RegisterForm
                            setInfo={setUserInfo}
                            info={userInfo}
                            title="Edit Profile"
                            onSubmit={() => setShowModal(false)}
                        >
                            <button
                                className="absolute top-0 right-2 !p-3 text-white/60 hover:text-white max-w-fit"
                                onClick={(e) => {e.currentTarget.blur(); setShowModal(false)}}
                            >
                                <X size={18} />
                            </button>
                        </RegisterForm>
                    </div>
                </div>
            )}
        </div>
    );
}