import Card from "@/components/ui/Card";

export default function SurveyCard() {

    return (

        <Card>

            <h3
                style={{
                    marginTop: 0,
                    marginBottom: 20,
                }}
            >
                Survey Information
            </h3>

            <table
                style={{
                    width: "100%",
                    borderSpacing: "0 12px",
                }}
            >
                <tbody>

                    <tr>
                        <td
                            style={{
                                width: 180,
                                color: "#64748b",
                                fontWeight: 600,
                            }}
                        >
                            Survey Status
                        </td>

                        <td>

                            Completed

                        </td>

                    </tr>

                    <tr>
                        <td
                            style={{
                                color: "#64748b",
                                fontWeight: 600,
                            }}
                        >
                            Survey Date
                        </td>

                        <td>

                            05/08/2026

                        </td>

                    </tr>

                    <tr>
                        <td
                            style={{
                                color: "#64748b",
                                fontWeight: 600,
                            }}
                        >
                            Images
                        </td>

                        <td>

                            15

                        </td>

                    </tr>

                    <tr>
                        <td
                            style={{
                                color: "#64748b",
                                fontWeight: 600,
                            }}
                        >
                            Coordinates
                        </td>

                        <td>

                            Available

                        </td>

                    </tr>

                </tbody>

            </table>

        </Card>

    );

}