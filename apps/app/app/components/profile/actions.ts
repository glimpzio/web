"use server";

import { gql } from "@apollo/client";
import { AUTH_HEADER } from "@glimpzio/config";
import { getClient, getClientFile } from "@glimpzio/hooks/graphql";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

interface Data {
    uploadProfilePicture: string;
}

export async function upsertUser(
    fieldFirstName: string,
    fieldLastName: string,
    fieldPersonalEmail: string,
    fieldBio: string,
    fieldProfilePicture: string,
    fieldProfilePictureUrl: string,
    fieldProfileEmail: string,
    fieldProfilePhone: string,
    fieldProfileWebsite: string,
    fieldProfileLinkedIn: string,
    formData: FormData
) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) throw Error("missing API url");

    const authToken = headers().get(AUTH_HEADER);
    if (!authToken) throw Error("auth token missing");

    const upsertClient = await getClient(apiUrl, authToken);

    const upsertQuery = gql`
        mutation UpsertUser(
            $firstName: String!
            $lastName: String!
            $personalEmail: String!
            $bio: String!
            $profilePicture: String
            $email: String
            $phone: String
            $website: String
            $linkedin: String
        ) {
            upsertUser(
                input: {
                    firstName: $firstName
                    lastName: $lastName
                    email: $personalEmail
                    bio: $bio
                    profilePicture: $profilePicture
                    profile: { email: $email, phone: $phone, website: $website, linkedin: $linkedin }
                }
            ) {
                id
            }
        }
    `;

    const firstName = formData.get(fieldFirstName);
    const lastName = formData.get(fieldLastName);
    const personalEmail = formData.get(fieldPersonalEmail);
    const bio = formData.get(fieldBio);
    const profilePicture = formData.get(fieldProfilePicture) as File;
    let profilePictureUrl = formData.get(fieldProfilePictureUrl);
    const email = formData.get(fieldProfileEmail);
    const phone = formData.get(fieldProfilePhone);
    const website = formData.get(fieldProfileWebsite);
    const linkedin = formData.get(fieldProfileLinkedIn);

    if (profilePicture.size) {
        const fileClient = await getClientFile(apiUrl, authToken);

        const fileQuery = gql`
            mutation UploadProfilePicture($file: Upload!) {
                uploadProfilePicture(file: $file)
            }
        `;

        const { data } = await fileClient.mutate<Data>({ mutation: fileQuery, variables: { file: profilePicture } });
        if (!data) throw Error("missing data");

        profilePictureUrl = data.uploadProfilePicture;
    }

    await upsertClient().mutate({
        mutation: upsertQuery,
        variables: {
            firstName,
            lastName,
            personalEmail,
            bio,
            profilePicture: profilePictureUrl,
            email,
            phone,
            website,
            linkedin,
        },
    });

    revalidatePath("/profile");
}
