type Props = {

    survey: number;

    documents: number;

    ftp: number;

    updated: string;

};

export default function StationSummary({

    survey,

    documents,

    ftp,

    updated,

}: Props) {

    const cardStyle: React.CSSProperties = {

        background: "#fff",

        borderRadius: 12,

        padding: 20,

        border: "1px solid #e5e7eb",

    };

    return (

        <div

            style={{

                display: "grid",

                gridTemplateColumns:
                    "repeat(4,1fr)",

                gap: 16,

            }}

        >

            <div style={cardStyle}>

                <div>Survey</div>

                <h2>{survey}</h2>

            </div>

            <div style={cardStyle}>

                <div>Documents</div>

                <h2>{documents}</h2>

            </div>

            <div style={cardStyle}>

                <div>FTP Files</div>

                <h2>{ftp}</h2>

            </div>

            <div style={cardStyle}>

                <div>Updated</div>

                <h2>{updated}</h2>

            </div>

        </div>

    );

}