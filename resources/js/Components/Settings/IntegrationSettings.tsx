import { Code, Zap } from "lucide-react";

export default function IntegrationSettings() {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Intégrations
            </h2>

            <div className="space-y-4">
                {/* Message d'information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Zap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-blue-900">
                                Intégrations tierces
                            </h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Cette section permet de connecter votre compte à
                                des services externes. Les intégrations
                                disponibles seront ajoutées prochainement.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Placeholder pour futures intégrations */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <div className="text-center">
                        <Code className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            Aucune intégration disponible
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Les intégrations API seront disponibles dans une
                            prochaine version.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
