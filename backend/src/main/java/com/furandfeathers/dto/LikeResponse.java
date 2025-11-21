package com.furandfeathers.dto;

public class LikeResponse {
    public long count;
    public boolean liked;

    public LikeResponse() {}

    public LikeResponse(long count, boolean liked) {
        this.count = count;
        this.liked = liked;
    }
}