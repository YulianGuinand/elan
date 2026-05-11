interface WelcomeBannerProps {
    userName: string;
    message: string;
}

export default function WelcomeBanner({
    userName,
    message,
}: WelcomeBannerProps) {
    return (
        <div className="bg-gradient-to-r from-elan-orange to-orange-300 rounded-lg p-8 text-white shadow-md">
            <h2 className="text-2xl font-bold mb-2">
                Ravi de vous revoir, {userName} !
            </h2>
            <p className="text-white/90 text-lg">{message}</p>
        </div>
    );
}
