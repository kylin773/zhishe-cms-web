import request from '@/utils/request'

export function getAllInvitationList(query) {
  return request({
    url: `/forum/posts`,
    method: 'get',
    params: query
  })
}

export function getInvitationList(clubid, query, originState) {
  return request({
    url: `/forum/${clubid}/posts`,
    method: 'get',
    params: query
  })
}

export function getInvitationDetail(id) {
  return request({
    url: `/forum/posts/${id}`,
    method: 'get'
  })
}

export function getRemarksList(id, query) {
  return request({
    url: `/forum/posts/${id}/remarks`,
    method: 'get',
    params: query
  })
}

export function postComment(actId, data) {
  return request({
    url: `/forum/posts/${actId}/remarks`,
    method: 'post',
    data
  })
}
