export function Footer() {
    return (
        <footer className="border-t py-12 bg-card mt-auto">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Oneside Store. All rights reserved.</p>
            </div>
        </footer>
    );
}
