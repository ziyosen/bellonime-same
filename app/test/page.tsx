export default function TestPage() {
    return (
        <div className="min-h-screen p-8">
            {/* Test 1: Background */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-4">Dark Mode Test</h1>
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <p className="text-slate-900 dark:text-slate-100">
                        Ini test box. Di light mode harusnya putih, di dark mode harusnya slate-900.
                    </p>
                </div>
            </div>

            {/* Test 2: Colors */}
            <div className="mb-8 space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded">
                    <p className="text-slate-900 dark:text-white">Background: slate-50 → slate-950</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded">
                    <p className="text-black dark:text-white">Background: white → slate-900</p>
                </div>
                <div className="p-4 bg-blue-500 dark:bg-red-500 rounded">
                    <p className="text-white">Background: blue-500 → red-500</p>
                </div>
            </div>

            {/* Test 3: Tailwind is working */}
            <div className="p-4 bg-green-500 text-white rounded">
                <p>Kalo box ini HIJAU, berarti Tailwind CSS working!</p>
            </div>
        </div>
    );
}
