import { useState } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddWeb3Wallet = () => {
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [walletNetwork, setWalletNetwork] = useState<string>("Ethereum");
    const [accountName, setAccountName] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Ethereum address validation regex
    const isValidEthereumAddress = (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        if (!isValidEthereumAddress(walletAddress)) {
            setErrorMessage("This address is not supported.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch("/api/wallets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walletAddress, walletNetwork, accountName }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 409) {
                    setErrorMessage("Wallet already exists.");
                } else {
                    setErrorMessage(`Failed to add wallet: ${errorText}`);
                }
            } else {
                setSuccessMessage("Wallet added successfully!");
                setWalletAddress("");
                setAccountName("");
            }
        } catch (error) {
            setErrorMessage("Error adding wallet. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Add Web3 Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="walletAddress">
                            Wallet Address
                        </label>
                        <Input
                            type="text"
                            value={walletAddress}
                            onChange={(event) => setWalletAddress(event.target.value)}
                            placeholder="Enter Ethereum wallet address"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errorMessage ? "border-red-500" : ""
                                }`}
                        />
                        {errorMessage && (
                            <p className="text-red-500 text-xs italic mt-2">{errorMessage}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="walletNetwork">
                            Wallet Network
                        </label>
                        <Select
                            value={walletNetwork}
                            onValueChange={(value) => setWalletNetwork(value)}
                        >
                            <SelectTrigger className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Ethereum">Ethereum</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accountName">
                            Account Name
                        </label>
                        <Input
                            type="text"
                            value={accountName}
                            onChange={(event) => setAccountName(event.target.value)}
                            placeholder="Enter account name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {isSubmitting ? "Adding..." : "Add Wallet"}
                        </Button>
                    </div>

                    {successMessage && (
                        <p className="text-green-500 text-xs italic mt-4">{successMessage}</p>
                    )}
                </CardContent>
            </Card>
        </form>
    );
};

export default AddWeb3Wallet;