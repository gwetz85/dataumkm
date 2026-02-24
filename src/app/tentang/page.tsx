'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function TentangPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold">Tentang Aplikasi</h1>
            <Card className="shadow-lg border-none bg-card/80">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Info /> Tentang SiDATA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-card-foreground/80">
                    <p className="font-semibold text-foreground">
                        SiDATA hadir sebagai solusi digital cerdas dalam pengelolaan data modern.
                    </p>
                    <p>
                        Dirancang untuk menjawab kebutuhan era transformasi digital, SiDATA mengintegrasikan proses pencatatan, pengolahan, analisis, dan pelaporan data dalam satu sistem yang efisien, aman, dan mudah digunakan.
                    </p>

                    <div className="py-2">
                        <p className="font-medium text-foreground">Dengan SiDATA:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Data menjadi lebih terstruktur</li>
                            <li>Proses menjadi lebih cepat</li>
                            <li>Informasi menjadi lebih akurat</li>
                            <li>Keputusan menjadi lebih tepat</li>
                        </ul>
                    </div>

                    <p className="italic">
                        SiDATA bukan sekadar aplikasi, tetapi fondasi pengelolaan data yang profesional dan berkelanjutan.
                    </p>
                    
                    <div className="text-foreground pt-4 mt-4 border-t">
                        <p>Aplikasi ini dikembangkan dan dibuat oleh <strong className="text-primary">AGUS SURIYADI</strong>, kritik dan saran bisa menghubungi melalui:</p>
                        <div className="mt-2 space-y-1 text-card-foreground/90">
                            <p>Whatsapp : 0817319885</p>
                            <p>Email : agussuriyadipunya@gmail.com</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
