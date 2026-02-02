import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Dashboard() {
    const { post, reset, setData } = useForm<{ file: File | null }>({
        file: null,
    });

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("upload-file"), {
            forceFormData: true,
            onError: (errors) => {
                if (errors.password) {
                    reset("file");
                }

                console.log(errors);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>

                        <form onSubmit={onSubmit} className="flex flex-col">
                            <label htmlFor="file">Fichier Excel</label>
                            <input
                                type="file"
                                id="file"
                                name="file"
                                onChange={(e) =>
                                    setData(
                                        "file",
                                        e.target.files
                                            ? e.target.files[0]
                                            : null,
                                    )
                                }
                            />

                            <button type="submit">Soumettre</button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
