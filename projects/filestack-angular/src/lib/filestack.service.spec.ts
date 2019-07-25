import { FilestackService } from './filestack.service';
import { Observable } from 'rxjs';

describe('FilestackService', () => {
  const fsClientMock = {
    picker() {
      return true;
    },
    transform() {
      return true;
    },
    retrieve() {
      return new Promise((resolve) => {
        resolve('Retrieve resolved');
      });
    },
    metadata() {
      return new Promise((resolve) => {
        resolve('Metadata resolved');
      });
    },
    storeURL() {
      return new Promise((resolve) => {
        resolve('StoreURL resolved');
      });
    },
    upload() {
      return new Promise((resolve) => {
        resolve('Upload resolved');
      });
    },
    remove() {
      return new Promise((resolve) => {
        resolve('Remove resolved');
      });
    },
    removeMetadata() {
      return new Promise((resolve) => {
        resolve('RemoveMetadata resolved');
      });
    },
    preview() {
      return true;
    },
    logout() {
      return new Promise((resolve) => {
        resolve('Logout resolved');
      });
    }
  };

  const exampleHandle = 'TESToQJSQCmYShsoCnZN';
  const exampleSecurity = {
    policy: 'eyJleHBpcnkiOjE1MjM1OTU2MDAsImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXSwiaGFuZGxlIjoiYmZUTkNpZ1JMcTBRTU9yc0ZLemIifQ==',
    signature: 'ab1624c9f219ca0118f1af43d21ee87a09a07645c15c9fdbb7447818739c2b8b',
  };
  const exampleToken = 'exampleToken';
  const exampleOptions = {
    cache: true,
    exif: false
  };
  const exampleUrl = 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Pears.jpg';
  const isB64 = false;
  const exampleFile = 'test.pdf';
  let service;
  beforeEach(() => {
    spyOn(fsClientMock, 'picker').and.callThrough();
    spyOn(fsClientMock, 'transform').and.callThrough();
    spyOn(fsClientMock, 'retrieve').and.callThrough();
    spyOn(fsClientMock, 'metadata').and.callThrough();
    spyOn(fsClientMock, 'storeURL').and.callThrough();
    spyOn(fsClientMock, 'upload').and.callThrough();
    spyOn(fsClientMock, 'remove').and.callThrough();
    spyOn(fsClientMock, 'removeMetadata').and.callThrough();
    spyOn(fsClientMock, 'preview').and.callThrough();
    spyOn(fsClientMock, 'logout').and.callThrough();
    service = new FilestackService();
    service.setClientInstance(fsClientMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('picker', () => {
    it('should pass proper params to client method', () => {
      service.picker(exampleOptions);
      expect(fsClientMock.picker).toHaveBeenCalledTimes(1);
      expect(fsClientMock.picker).toHaveBeenCalledWith(exampleOptions);
    });
  });

  describe('transform', () => {
    it('should pass proper params to client method', () => {
      service.transform(exampleUrl, exampleOptions, isB64);
      expect(fsClientMock.transform).toHaveBeenCalledTimes(1);
      expect(fsClientMock.transform).toHaveBeenCalledWith(exampleUrl, exampleOptions, isB64);
    });
  });

  describe('retrieve', () => {
    it('should pass proper params to client method', () => {
      const result = service.retrieve(exampleHandle, exampleOptions, exampleSecurity);
      expect(fsClientMock.retrieve).toHaveBeenCalledTimes(1);
      expect(fsClientMock.retrieve).toHaveBeenCalledWith(exampleHandle, exampleOptions, exampleSecurity);
      expect(result).toEqual(jasmine.any(Observable));
    });
    it('should return observable', (done: DoneFn) => {
      service.retrieve(exampleHandle, exampleOptions, exampleSecurity).subscribe(value => {
        expect(value).toBe('Retrieve resolved');
        done();
      });
    });
  });

  describe('metadata method', () => {
    it('should pass proper params to client method', () => {
      const result = service.metadata(exampleHandle, exampleOptions, exampleSecurity);
      expect(fsClientMock.metadata).toHaveBeenCalledTimes(1);
      expect(fsClientMock.metadata).toHaveBeenCalledWith(exampleHandle, exampleOptions, exampleSecurity);
      expect(result).toEqual(jasmine.any(Observable));
    });
    it('should return observable', (done: DoneFn) => {
      service.metadata(exampleHandle, exampleOptions, exampleSecurity).subscribe(value => {
        expect(value).toBe('Metadata resolved');
        done();
      });
    });
  });

  describe('storeURL method', () => {
    it('should pass proper params to client method', () => {
      const result = service.storeURL(exampleHandle, exampleOptions, exampleToken, exampleSecurity);
      expect(fsClientMock.storeURL).toHaveBeenCalledTimes(1);
      expect(fsClientMock.storeURL).toHaveBeenCalledWith(exampleHandle, exampleOptions, exampleToken, exampleSecurity);
      expect(result).toEqual(jasmine.any(Observable));
    });
    it('should return observable', (done: DoneFn) => {
      service.storeURL(exampleHandle, exampleOptions, exampleSecurity).subscribe(value => {
        expect(value).toBe('StoreURL resolved');
        done();
      });
    });
  });

  describe('upload method', () => {
    it('should pass proper params to client method', () => {
      const result = service.upload(exampleFile, exampleOptions, exampleOptions, exampleToken, exampleSecurity);
      expect(fsClientMock.upload).toHaveBeenCalledTimes(1);
      expect(fsClientMock.upload).toHaveBeenCalledWith(exampleFile, exampleOptions, exampleOptions, exampleToken, exampleSecurity);
      expect(result).toEqual(jasmine.any(Observable));
    });
    it('should return observable', (done: DoneFn) => {
      service.upload(exampleFile, exampleOptions, exampleOptions, exampleToken, exampleSecurity).subscribe(value => {
        expect(value).toBe('Upload resolved');
        done();
      });
    });
  });

  describe('remove method', () => {
    it('should pass proper params to client method', () => {
      const result = service.remove(exampleHandle, exampleSecurity);
      expect(fsClientMock.remove).toHaveBeenCalledTimes(1);
      expect(fsClientMock.remove).toHaveBeenCalledWith(exampleHandle, exampleSecurity);
      expect(result).toEqual(jasmine.any(Observable));
    });
    it('should return observable', (done: DoneFn) => {
      service.remove(exampleHandle, exampleSecurity).subscribe(value => {
        expect(value).toBe('Remove resolved');
        done();
      });
    });
  });

  describe('removeMetadata method', () => {
    it('should pass proper params to client method', () => {
      const result = service.removeMetadata(exampleHandle, exampleSecurity);
      expect(fsClientMock.removeMetadata).toHaveBeenCalledTimes(1);
      expect(fsClientMock.removeMetadata).toHaveBeenCalledWith(exampleHandle, exampleSecurity);
      expect(result).toEqual(jasmine.any(Observable));
    });
    it('should return observable', (done: DoneFn) => {
      service.removeMetadata(exampleHandle, exampleSecurity).subscribe(value => {
        expect(value).toBe('RemoveMetadata resolved');
        done();
      });
    });
  });

  describe('preview method', () => {
    it('should pass proper params to client method', () => {
      service.preview(exampleUrl, exampleOptions);
      expect(fsClientMock.preview).toHaveBeenCalledTimes(1);
      expect(fsClientMock.preview).toHaveBeenCalledWith(exampleUrl, exampleOptions);
    });
  });

  describe('logout method', () => {
    it('should pass proper params to client method', () => {
      const result = service.logout('dropbox');
      expect(fsClientMock.logout).toHaveBeenCalledTimes(1);
      expect(fsClientMock.logout).toHaveBeenCalledWith('dropbox');
      expect(result).toEqual(jasmine.any(Observable));
    });
    it('should return observable', (done: DoneFn) => {
      service.logout('dropbox').subscribe(value => {
        expect(value).toBe('Logout resolved');
        done();
      });
    });
  });
});
